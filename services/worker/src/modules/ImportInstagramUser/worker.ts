import { AppLogger } from '@m-nny/common';
import { Processor, Worker } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { ImportInstagramUserData } from './types';

@singleton()
export class ImportInstagramUserWorker {
    private worker: Worker<ImportInstagramUserData>;
    public constructor({ config }: ConfigWrapper, private logger: AppLogger) {
        this.worker = new Worker(config.queue.names.importInstagramUser, this.jobProcessor);
    }
    public waitUntilReady = () => this.worker.waitUntilReady();
    private jobProcessor: Processor<ImportInstagramUserData> = async (job) => {
        const { data } = job;
        this.logger.debug(job, `Running job #${job.id ?? 0}`);
        this.logger.info(data, `importing instagram user @${data.username}`);
    };
}
