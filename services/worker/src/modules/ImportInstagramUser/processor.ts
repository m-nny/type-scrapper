import { AppLogger } from '@app/common';
import {
    ImportInstagramUserData,
    ImportInstagramUserJob,
    isImportInstagramUserJob,
    JobHandlers,
    okResult,
    throwIfError,
    unimplementedErrorFactory,
    UnknownJobNameError
} from '@app/models';
import { Job, Processor } from 'bullmq';
import _ from 'lodash';
import { singleton } from 'tsyringe';
import { BrainMicroservice } from '../brain/BrainService';
import { CreateInstagramUserMutationVariables } from '../brain/sdk';
import { InstagramMicroservice } from '../instagram/InstagramService';
import { GetFollowersQuery, GetProfileQuery } from '../instagram/sdk';
import { QueueMicroservice } from '../queue/QueueService';

type ImportInstagramUserJobHandlers = JobHandlers<ImportInstagramUserJob, Job<ImportInstagramUserData>>;

@singleton()
export class ImportInstagramUserProcessor {
    private instagramSdk;
    private brainSdk;
    private queueSdk;
    public constructor(
        private logger: AppLogger,
        instagramService: InstagramMicroservice,
        brainService: BrainMicroservice,
        queueService: QueueMicroservice,
    ) {
        this.instagramSdk = instagramService.sdk;
        this.brainSdk = brainService.sdk;
        this.queueSdk = queueService.sdk;
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
            const followers = await this.getAllUserFollowers(data.username);
            this.logger.debug(filterFollowers(followers), `Got user followers. first batch`);
            return unimplementedErrorFactory('getUserFollowings');
        },
        getUserFollowings: async (job) => {
            return unimplementedErrorFactory('getUserFollowings');
        },
    };

    private getAllUserFollowers = async (username: string): Promise<GetAllUserFollowersResult> => {
        let cursor = undefined;
        const followers = [];
        let count = 0;
        while (true) {
            const result: GetFollowersQuery = await this.instagramSdk.getFollowers({ username, cursor });
            const userFollowers = result.user.followers;
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

type GetAllUserFollowersResult = {
    count: number;
    followers: string[];
};

const filterJob = (job: Job) => _.pick(job, ['id', 'name', 'data']);

const filterUserFollowers = (followers: string[]) => ({
    followers: filterArray(followers),
});
const filterFollowers = ({ followers, ...rest }: GetAllUserFollowersResult) => ({
    followers: filterArray(followers),
    ...rest,
});
const filterArray = (array: string[]) =>
    array.length < 5 ? array : { length: array.length, head: array.slice(0, 1)[0], tail: array.slice(-1)[0] };

const makeInstagramUserInput = ({
    user: { username, ...info },
}: GetProfileQuery): CreateInstagramUserMutationVariables => ({
    user: {
        username,
        info,
    },
});
