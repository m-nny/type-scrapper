import { BullMQAdapter, setQueues } from 'bull-board';
import { Queue } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';

export const useQueues = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const queues = [new Queue(config.queue.names.importInstagramUser, { connection: redis })];
    const queueAdapters = queues.map((queue) => new BullMQAdapter(queue));
    setQueues(queueAdapters);
};
