import { ImportInstagramUserData, ImportInstagramUserJob } from '@app/models';
import { Queue } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../../config';
import { RedisWrapper } from '../../utils/wrappers';

@singleton()
export class ImportInstagramUserQueue {
    private queue: Queue<ImportInstagramUserData>;
    private defaultJobOptions;
    public constructor({ config }: ConfigWrapper, { redis }: RedisWrapper) {
        this.queue = new Queue(config.queue.names.importInstagramUser, { connection: redis });
        this.defaultJobOptions = config.queue.jobOptions;
    }
    public addJob(jobName: ImportInstagramUserJob, data: ImportInstagramUserData) {
        return this.queue.add(jobName, data, this.defaultJobOptions);
    }
}
