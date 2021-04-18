import { Worker } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';
import { ImportInstagramUserProcessor } from './processor';

export const importInstagramUserWorkerFactory = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const processorFactory = container.resolve(ImportInstagramUserProcessor);
    const queueName = config.queue.names.importInstagramUser;
    const worker = new Worker(queueName, processorFactory.processor, { connection: redis });
    return [worker, queueName] as const;
};
