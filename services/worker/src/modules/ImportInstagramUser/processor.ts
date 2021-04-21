import { AppLogger } from '@app/common';
import {
    ImportInstagramUserData,
    ImportInstagramUserJob,
    isImportInstagramUserJob,
    JobHandlers,
    okResult,
    throwIfError,
    UnknownJobNameError,
} from '@app/models';
import { Job, Processor } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { BrainMicroservice } from '../brain/BrainService';
import {
    AddInstagramUserFollowedByMutationVariables,
    AddInstagramUserIsFollowingMutationVariables,
    CreateInstagramUserMutationVariables,
} from '../brain/sdk';
import { filterJob, filterUserFollowers } from '../common/filters';
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
            this.logger.debug(filterJob(job), `Running job #${job.id ?? 0}`);
            try {
                if (!isImportInstagramUserJob(job.name)) {
                    throw new UnknownJobNameError(job.name, this.jobHandlers);
                }
                const handler = this.jobHandlers[job.name];
                const result = await handler(job).then(throwIfError);
                return result;
            } catch (error) {
                this.logError(job, error);
            }
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
            return okResult;
        },
        getUserFollowers: async (job) => {
            const { data } = job;
            const instagramProfile = await this.instagramSdk.getProfile(data);
            const followers = await this.getAllUserFollowers(instagramProfile.user.id);
            this.logger.debug(filterFollowers(followers), `Got user followers`);
            const imported = await this.brainSdk.addInstagramUserFollowedBy(hydrateFollowers(data.username, followers));
            this.logger.info(imported, `saved user followers`);
            return okResult;
        },
        getUserFollowings: async (job) => {
            const { data } = job;
            const instagramProfile = await this.instagramSdk.getProfile(data);
            const followings = await this.getAllUserFollowings(instagramProfile.user.id);
            this.logger.debug(filterFollowings(followings), `Got user followings`);
            const imported = await this.brainSdk.addInstagramUserIsFollowing(
                hydrateFollowings(data.username, followings),
            );
            this.logger.info(imported, `saved user followings`);
            return okResult;
        },
    };

    private getAllUserFollowings = async (
        userId: string,
        maxNumber = this.maxFollowersNumber,
    ): Promise<GetAllUserFollowingsResult> => {
        let cursor = undefined;
        const followings = [];
        let count = 0;
        while (followings.length < maxNumber) {
            const result: GetFollowingsByIdQuery = await this.instagramSdk.getFollowingsById({ userId, cursor });
            const userFollowings = result.followingsById;
            const userFollowingsUsername = userFollowings.data.map((user) => user.username);
            const hasNextPage = userFollowings.page_info.has_next_page;
            cursor = userFollowings.page_info.end_cursor;
            count = userFollowings.count;

            followings.push(...userFollowingsUsername);
            this.logger.debug(
                filterUserFollowers(userFollowingsUsername),
                `Got user ${userFollowingsUsername.length} followings. Has nextPage ${hasNextPage}`,
            );
            if (!hasNextPage) {
                break;
            }
        }
        return { count, followings };
    };

    private getAllUserFollowers = async (
        userId: string,
        maxNumber = this.maxFollowersNumber,
    ): Promise<GetAllUserFollowersResult> => {
        let cursor = undefined;
        const followers = [];
        let count = 0;
        while (followers.length < maxNumber) {
            const result: GetFollowersByIdQuery = await this.instagramSdk.getFollowersById({ userId, cursor });
            const userFollowers = result.followersById;
            const userFollowersUsername = userFollowers.data.map((user) => user.username);
            const hasNextPage = userFollowers.page_info.has_next_page;
            cursor = userFollowers.page_info.end_cursor;
            count = userFollowers.count;

            followers.push(...userFollowersUsername);
            this.logger.debug(
                filterUserFollowers(userFollowersUsername),
                `Got user ${userFollowersUsername.length} followers. Has nextPage ${hasNextPage}`,
            );
            if (!hasNextPage) {
                break;
            }
        }
        return { count, followers };
    };

    private logError<T, D>(job: Job<T>, error: any): D {
        const jobName = job.name;
        this.logger.error({ error, jobName }, `Error processing job ${jobName} in queue `);
        throw error;
    }
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
