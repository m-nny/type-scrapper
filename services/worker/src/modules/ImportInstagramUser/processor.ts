import { AppLogger } from '@app/common';
import {
    ImportInstagramUserData,
    ImportInstagramUserJob,
    isImportInstagramUserJob,
    JobHandlers,
    throwIfError,
    UnknownJobNameError
} from '@app/models';
import { Job, Processor } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { BrainMicroservice } from '../brain/BrainService';
import {
    AddInstagramUserFollowedByMutationVariables,
    AddInstagramUserIsFollowingMutationVariables,
    CreateInstagramUserMutationVariables
} from '../brain/sdk';
import { filterError, filterJob, filterUserFollowers } from '../common/filters';
import { InstagramMicroservice } from '../instagram/InstagramService';
import { GetFollowersByIdQuery, GetFollowingsByIdQuery, GetProfileQuery } from '../instagram/sdk';
import { QueueMicroservice } from '../queue/QueueService';
import { filterFollowers, filterFollowings, GetAllUserFollowersResult, GetAllUserFollowingsResult } from './filters';

type ImportInstagramUserJobHandlers = JobHandlers<ImportInstagramUserJob, Job<ImportInstagramUserData>>;

@singleton()
export class ImportInstagramUserProcessor {
    private instagramSdk;
    private brainSdk;
    private queueSdk;
    private maxFollowersNumber: number;
    public constructor(
        private logger: AppLogger,
        instagramService: InstagramMicroservice,
        brainService: BrainMicroservice,
        queueService: QueueMicroservice,
        { config }: ConfigWrapper,
    ) {
        this.instagramSdk = instagramService.sdk;
        this.brainSdk = brainService.sdk;
        this.queueSdk = queueService.sdk;
        this.maxFollowersNumber = config.instagram.maxFollowersNumber;
    }
    public get processor(): Processor<ImportInstagramUserData> {
        return async (job) => {
            const jobName = job.name;
            this.logger.debug(filterJob(job), `Running job #${job.id ?? 0}`);
            if (!isImportInstagramUserJob(jobName)) {
                throw new UnknownJobNameError(jobName, this.jobHandlers);
            }
            const handler = this.jobHandlers[jobName];
            const result = await handler(job);
            this.logger.info({ result, jobName }, `Job ${jobName} finished`);
            return throwIfError(result);
        };
    }

    private jobHandlers: ImportInstagramUserJobHandlers = {
        getUserProfile: async (job) => {
            const { data } = job;
            this.logger.info(data, `importing instagram user @${data.username}`);
            const instagramProfile = await this.instagramSdk.getProfile(data);
            this.logger.info(instagramProfile, `got user profile`);
            const brainSaved = await this.brainSdk.createInstagramUser(makeInstagramUserInput(instagramProfile));
            this.logger.info(brainSaved, `saved user profile`);

            await this.queueSdk.addImportUserJob({ jobName: 'getUserFollowers', jobData: data });
            await this.queueSdk.addImportUserJob({ jobName: 'getUserFollowings', jobData: data });
            return instagramProfile.user;
        },
        getUserFollowers: async (job) => {
            const {
                data: { cursor, username },
            } = job;
            const userId = await this.instagramSdk.getProfile({ username }).then((profile) => profile.user.id);
            const followers = await this.getAllUserFollowers({ userId, cursor });
            if (followers.cursor) {
                this.logger.debug(
                    { alreadyGot: followers.followers.length, total: followers.count },
                    `User got more followers. Adding another job`,
                );
                await this.queueSdk.addImportUserJob({
                    jobName: 'getUserFollowers',
                    jobData: { username, cursor: followers.cursor },
                });
            }
            this.logger.debug(filterFollowers(followers), `Got user followers`);
            const imported = await this.brainSdk.addInstagramUserFollowedBy(hydrateFollowers(username, followers));
            this.logger.info(imported, `saved user followers`);
            return { importedFollowers: imported.instagramUserFollowedBy, username, userId };
        },
        getUserFollowings: async (job) => {
            const {
                data: { username, cursor },
            } = job;
            const userId = await this.instagramSdk.getProfile({ username }).then((profile) => profile.user.id);
            const followings = await this.getAllUserFollowings({ userId, cursor });
            if (followings.cursor) {
                this.logger.debug(
                    { alreadyGot: followings.followings.length, total: followings.count },
                    `User got more followings. Adding another job`,
                );
                await this.queueSdk.addImportUserJob({
                    jobName: 'getUserFollowings',
                    jobData: { username, cursor: followings.cursor },
                });
            }
            this.logger.debug(filterFollowings(followings), `Got user followings`);
            const imported = await this.brainSdk.addInstagramUserIsFollowing(hydrateFollowings(username, followings));
            this.logger.info(imported, `saved user followings`);
            return { importedFollowings: imported.instagramUserFollowing, username, userId };
        },
    };

    private getAllUserFollowings = async ({
        userId,
        cursor,
        maxNumber = this.maxFollowersNumber,
    }: GetFollowersArgs): Promise<GetAllUserFollowingsResult> => {
        const followings = [];
        let count = 0;
        while (followings.length < maxNumber) {
            try {
                const result: GetFollowingsByIdQuery = await this.instagramSdk.getFollowingsById({ userId, cursor });
                const userFollowings = result.followingsById;
                const userFollowingsUsername = userFollowings.data.map((user) => user.username);
                const hasNextPage = userFollowings.page_info.has_next_page;
                cursor = userFollowings.page_info.end_cursor ?? undefined;
                count = userFollowings.count;

                followings.push(...userFollowingsUsername);
                this.logger.debug(
                    filterUserFollowers(userFollowingsUsername),
                    `Got user ${userFollowingsUsername.length} followings. Has nextPage ${hasNextPage}`,
                );
                if (!hasNextPage) {
                    break;
                }
            } catch (e) {
                if (followings.length === 0) {
                    throw e;
                }
                this.logger.error(filterError(e), 'Some error happened while getting followings');
                break;
            }
        }
        return { count, followings, cursor };
    };

    private getAllUserFollowers = async ({
        userId,
        cursor,
        maxNumber = this.maxFollowersNumber,
    }: GetFollowersArgs): Promise<GetAllUserFollowersResult> => {
        const followers = [];
        let count = 0;
        while (followers.length < maxNumber) {
            try {
                const result: GetFollowersByIdQuery = await this.instagramSdk.getFollowersById({ userId, cursor });
                const userFollowers = result.followersById;
                const userFollowersUsername = userFollowers.data.map((user) => user.username);
                const hasNextPage = userFollowers.page_info.has_next_page;
                cursor = userFollowers.page_info.end_cursor ?? undefined;
                count = userFollowers.count;

                followers.push(...userFollowersUsername);
                this.logger.debug(
                    filterUserFollowers(userFollowersUsername),
                    `Got user ${userFollowersUsername.length} followers. Has nextPage ${hasNextPage}`,
                );
                if (!hasNextPage) {
                    break;
                }
            } catch (e) {
                if (followers.length === 0) {
                    throw e;
                }
                this.logger.error(filterError(e), 'Some error happened while getting followers');
                break;
            }
        }
        return { count, followers, cursor };
    };

}

const makeInstagramUserInput = ({
    user: { username, ...info },
}: GetProfileQuery): CreateInstagramUserMutationVariables => ({
    user: {
        username,
        info,
    },
});

const hydrateFollowings = (
    username: string,
    { followings }: GetAllUserFollowingsResult,
): AddInstagramUserIsFollowingMutationVariables => ({
    username,
    following: followings,
});
const hydrateFollowers = (
    username: string,
    { followers }: GetAllUserFollowersResult,
): AddInstagramUserFollowedByMutationVariables => ({
    username,
    followedBy: followers,
});
type GetFollowersArgs = {
    userId: string;
    maxNumber?: number;
    cursor?: string;
};
