import { QueueScheduler, Worker } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';
import { EnqueueJobProcessor } from './processor';

export const enqueueImportWorkerFactory = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const processorFactory = container.resolve(EnqueueJobProcessor);
    const queueName = config.queue.names.enqueueImport;
    const worker = new Worker(queueName, processorFactory.processor, { ...config.worker, connection: redis });
    return [worker, queueName] as const;
};
