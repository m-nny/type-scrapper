import { AppLogger } from '@app/common';
import {
    ImportInstagramUserArg,
    ImportInstagramUserJob,
    isImportInstagramUserJob,
    isResultError,
    JobHandlers,
    makeResultErrorOnReject,
    okResult,
    unimplementedErrorFactory,
    UnknownJobNameError
} from '@app/models';
import { Job, Processor, Worker } from 'bullmq';
import _ from 'lodash';
import { DependencyContainer, singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { BrainMicroservice } from '../brain/BrainService';
import { InstagramMicroservice } from '../instagram/InstagramService';
import { RedisWrapper } from '../utils/wrappers';

export const importInstagramUserWorkerFactory = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const processorFactory = container.resolve(ImportInstagramUserProcessor);
    const queueName = config.queue.names.importInstagramUser;
    const worker = new Worker(queueName, processorFactory.processor, { connection: redis });
    return [worker, queueName] as const;
};
type ImportInstagramUserJobHandlers = JobHandlers<ImportInstagramUserJob, Job<ImportInstagramUserArg>>;

@singleton()
export class ImportInstagramUserProcessor {
    private instagramSdk;
    private brainSdk;
    public constructor(
        private logger: AppLogger,
        instagramService: InstagramMicroservice,
        brainService: BrainMicroservice,
    ) {
        this.instagramSdk = instagramService.sdk;
        this.brainSdk = brainService.sdk;
    }
    public get processor(): Processor<ImportInstagramUserArg> {
        return async (job) => {
            this.logger.debug(filterJob(job), `Running job #${job.id ?? 0}`);
            try {
                if (!isImportInstagramUserJob(job.name)) {
                    throw new UnknownJobNameError(job.name, this.jobHandlers);
                }
                const handler = this.jobHandlers[job.name];
                const result = await handler(job);
                return result;
                // .then((result) => (isResultError(result) ? this.logError(job, result) : result));
            } catch (error) {
                this.logError(job, error);
            }
        };
    }

    private jobHandlers: ImportInstagramUserJobHandlers = {
        getUserProfile: async (job) => {
            const { data } = job;
            this.logger.info(data, `importing instagram user @${data.username}`);
            const instagramProfile = await this.instagramSdk.getProfile(data).catch(makeResultErrorOnReject());
            if (isResultError(instagramProfile)) {
                return instagramProfile;
            }
            const { user } = instagramProfile;
            this.logger.info(user, `got user profile`);
            const brainSaved = await this.brainSdk.createInstagramUser({ user }).catch(makeResultErrorOnReject());
            if (isResultError(brainSaved)) {
                return brainSaved;
            }
            this.logger.info(brainSaved, `saved user profile`);
            return okResult;
        },
        getUserFollowers: async (job) => {
            return unimplementedErrorFactory('getUserFollowers');
        },
        getUserFollowings: async (job) => {
            return unimplementedErrorFactory('getUserFollowings');
        },
    };

    private logError<T, D>(job: Job<T>, error: any): D {
        const jobName = job.name;
        this.logger.error({ error, jobName }, `Error processing job ${jobName} in queue `);
        throw error;
    }
}

const filterJob = (job: Job) => _.pick(job, ['id', 'name', 'data']);
