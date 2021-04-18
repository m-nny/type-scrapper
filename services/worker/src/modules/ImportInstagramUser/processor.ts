import { AppLogger } from '@app/common';
import {
    ImportInstagramUserData,
    ImportInstagramUserJob,
    isImportInstagramUserJob,
    isResultError,
    JobHandlers,
    makeResultErrorOnReject,
    okResult,
    throwIfError,
    unimplementedErrorFactory,
    UnknownJobNameError
} from '@app/models';
import { Job, Processor } from 'bullmq';
import _ from 'lodash';
import { singleton } from 'tsyringe';
import { BrainMicroservice } from '../brain/BrainService';
import { InstagramMicroservice } from '../instagram/InstagramService';
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

            await this.queueSdk.addImportUserJob({ jobName: 'getUserFollowers', jobData: data });
            await this.queueSdk.addImportUserJob({ jobName: 'getUserFollowings', jobData: data });
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
