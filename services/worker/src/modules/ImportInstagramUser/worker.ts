import { AppLogger } from '@m-nny/common';
import { Processor, Queue, Worker } from 'bullmq';
import { DependencyContainer, singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';
import { ImportInstagramUserData } from './types';

@singleton()
export class ImportInstagramUserWorker {
    private worker: Worker<ImportInstagramUserData>;
    public constructor(private logger: AppLogger, { config }: ConfigWrapper, { redis }: RedisWrapper) {
        this.worker = new Worker(config.queue.names.importInstagramUser, this.jobProcessor, { connection: redis });
    }
    public waitUntilReady = () => this.worker.waitUntilReady();
    private jobProcessor: Processor<ImportInstagramUserData> = async (job) => {
        const { data } = job;
        this.logger.debug(job, `Running job #${job.id ?? 0}`);
        this.logger.info(data, `importing instagram user @${data.username}`);
    };
}
