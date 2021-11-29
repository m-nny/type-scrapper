import { BullMQAdapter, setQueues } from 'bull-board';
import { Queue } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';

export const useQueues = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const queueNames = config.queue.names;
    const queues = [queueNames.importInstagramUser, queueNames.enqueueImport]
        .map((queueName) => new Queue(queueName, { connection: redis, defaultJobOptions: config.queue.jobOptions }))
        .map((queue) => new BullMQAdapter(queue));
    setQueues(queues);
};
