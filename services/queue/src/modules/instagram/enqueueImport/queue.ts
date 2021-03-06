import { EnqueueImportData, EnqueueImportJob } from '@app/models';
import { Queue } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../../config';
import { RedisWrapper } from '../../utils/wrappers';

@singleton()
export class EnqueueImportQueue {
    private queue: Queue<EnqueueImportData>;
    private defaultJobOptions;
    public constructor({ config }: ConfigWrapper, { redis }: RedisWrapper) {
        this.queue = new Queue(config.queue.names.enqueueImport, { connection: redis });
        this.defaultJobOptions = config.queue.jobOptions;
    }
    public addJob(jobName: EnqueueImportJob, data: EnqueueImportData) {
        return this.queue.add(jobName, data, this.defaultJobOptions);
    }
}
