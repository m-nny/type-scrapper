import { AppLogger } from '@m-nny/common';
import { pick } from 'lodash';
import { Job, Processor, Worker } from 'bullmq';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { InstagramService } from '../instagram/service';
import { RedisWrapper } from '../utils/wrappers';
import { ImportInstagramUserData } from './types';

@singleton()
export class ImportInstagramUserWorker {
    private worker: Worker<ImportInstagramUserData>;
    public constructor(
        private logger: AppLogger,
        { config }: ConfigWrapper,
        { redis }: RedisWrapper,
        private instagramService: InstagramService,
    ) {
        this.worker = new Worker(config.queue.names.importInstagramUser, this.jobProcessor, { connection: redis });
    }
    public waitUntilReady = () => this.worker.waitUntilReady();
    private jobProcessor: Processor<ImportInstagramUserData> = async (job) => {
        const { data } = job;
        this.logger.debug(job.data, `Running job #${job.id ?? 0}`);
        this.logger.info(data, `importing instagram user @${data.username}`);
        const feed = await this.instagramService.getProfileByUsername(data.username);
        this.logger.debug(feed as any, 'Got feed');
    };
}

const filterJob = (job: Job) => pick(job, ['id', 'data']);