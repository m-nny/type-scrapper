import { AppLogger, axios } from '@app/common';
import { isResultError, okResult, Result } from '@app/common/dist/axios';
import { Job, Processor, Worker } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { BrainMicroservice } from '../brain/BrainService';
import { InstagramMicroservice } from '../instagram/InstagramService';
import { RedisWrapper } from '../utils/wrappers';
import { ImportInstagramUserData } from './types';

@singleton()
export class ImportInstagramUserWorker {
    public readonly queueName: string;
    private worker: Worker<ImportInstagramUserData>;
    private instagramSdk;
    private brainSdk;
    public constructor(
        private logger: AppLogger,
        instagramService: InstagramMicroservice,
        brainService: BrainMicroservice,
        { config }: ConfigWrapper,
        { redis }: RedisWrapper,
    ) {
        this.queueName = config.queue.names.importInstagramUser;
        this.worker = new Worker(this.queueName, this.logOnError(this.jobProcessor), { connection: redis });
        this.instagramSdk = instagramService.sdk;
        this.brainSdk = brainService.sdk;
    }
    public waitUntilReady = () => this.worker.waitUntilReady();
    public close = () => this.worker.close();
    private jobProcessor: Processor<ImportInstagramUserData> = async (job) => {
        const { data } = job;
        this.logger.debug(job, `Running job #${job.id ?? 0}`);
        this.logger.info(data, `importing instagram user @${data.username}`);
        const instagramProfile = await this.instagramSdk.getProfile(data).catch(axios.makeResultErrorOnReject());
        if (isResultError(instagramProfile)) {
            return instagramProfile;
        }
        const { user } = instagramProfile;
        this.logger.info(user, `got user data`);
        const brainSaved = await this.brainSdk.createInstagramUser({ user }).catch(axios.makeResultErrorOnReject());
        if (isResultError(brainSaved)) {
            return brainSaved;
        }
        this.logger.info(brainSaved, `saved user data`);
        return okResult;
    };
    private logOnError = <T, D>(processor: Processor<T, Result<D>>): Processor<T, D> => (job) =>
        processor(job)
            .catch((error) => this.logError<T, D>(job, error))
            .then((result) => (isResultError(result) ? this.logError(job, result) : result));

    private logError<T, D>(job: Job<T>, error: any): D {
        const jobName = job.name;
        const queueName = this.queueName;
        this.logger.error({ error, jobName, queueName }, `Error processing job ${jobName} in queue ${queueName}`);
        throw error;
    }
}
