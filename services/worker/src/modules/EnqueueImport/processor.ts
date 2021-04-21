import { AppLogger } from '@app/common';
import {
    EnqueueImportData,
    EnqueueImportJob,
    isEnqueueImportJob,
    JobHandlers,
    okResult,
    throwIfError,
    UnknownJobNameError
} from '@app/models';
import { Job, Processor } from 'bullmq';
import { singleton } from 'tsyringe';
import { BrainMicroservice } from '../brain/BrainService';
import { GetMostFollowedInstagramUserQuery } from '../brain/sdk';
import { filterArray, filterJob } from '../common/filters';
import { QueueMicroservice } from '../queue/QueueService';
import { AddImportUserJobMutationVariables } from '../queue/sdk';

type EnqueueImportJobHandlers = JobHandlers<EnqueueImportJob, Job<EnqueueImportData>>;

@singleton()
export class EnqueueJobProcessor {
    private brainSdk;
    private queueSdk;
    public constructor(private logger: AppLogger, queueService: QueueMicroservice, brainService: BrainMicroservice) {
        this.brainSdk = brainService.sdk;
        this.queueSdk = queueService.sdk;
    }
    public get processor(): Processor<EnqueueImportData> {
        return async (job) => {
            this.logger.debug(filterJob(job), `Running job #${job.id ?? 0}`);
            try {
                if (!isEnqueueImportJob(job.name)) {
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

    private jobHandlers: EnqueueImportJobHandlers = {
        mostFollowed: async (job) => {
            const args = job.data;
            const data = await this.brainSdk.getMostFollowedInstagramUser({ take: args.count });
            this.logger.info(filterMostFollowed(data), `got most followed users`);
            const enqueued = await Promise.all(hydrate(data).map((payload) => this.queueSdk.addImportUserJob(payload)));
            this.logger.info(`enqueued import for ${enqueued.length} users`);
            return okResult;
        },
    };
    private logError<T, D>(job: Job<T>, error: any): D {
        const jobName = job.name;
        this.logger.error({ error, jobName }, `Error processing job ${jobName} in queue `);
        throw error;
    }
}

const hydrate = (mostFollowed: GetMostFollowedInstagramUserQuery): AddImportUserJobMutationVariables[] =>
    mostFollowed.mostFollowedNotImportedUsers.items.map(({ username }) => ({ jobData: { username } }));

const filterMostFollowed = ({ mostFollowedNotImportedUsers: { items } }: GetMostFollowedInstagramUserQuery) =>
    filterArray(items);
