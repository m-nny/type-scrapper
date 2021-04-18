import { AppLogger } from '@app/common';
import { QueueScheduler } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';

export const runScheduler = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const { config } = container.resolve(ConfigWrapper);
    const queueName = config.queue.names.importInstagramUser;
    const scheduler = new QueueScheduler(queueName);
    await scheduler.waitUntilReady();
    logger.info({ queueName }, `Running scheduler on ${queueName}`);
    return scheduler;
};
