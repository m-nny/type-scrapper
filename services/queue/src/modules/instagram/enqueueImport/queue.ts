import { EnqueueImportJob } from '@app/models';
import { Queue } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../../config';
import { RedisWrapper } from '../../utils/wrappers';

type EnqueueImportData = void;
@singleton()
export class EnqueueImportQueue {
    private queue: Queue<EnqueueImportData>;
    public constructor({ config }: ConfigWrapper, { redis }: RedisWrapper) {
        this.queue = new Queue(config.queue.names.enqueueImport, { connection: redis });
    }
    public addJob(jobName: EnqueueImportJob, data: EnqueueImportData) {
        return this.queue.add(jobName, data);
    }
}
