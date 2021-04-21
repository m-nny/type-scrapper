import { getAppLogger } from '@app/common';
import { QueueScheduler } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { ConfigWrapper } from '../../config';
import { RedisWrapper } from '../utils/wrappers';

export const schedulerFactory = (container: DependencyContainer, queueName: string) => {
    const { config } = container.resolve(ConfigWrapper);
    const { redis } = container.resolve(RedisWrapper);
    const scheduler = new QueueScheduler(queueName, { ...config.scheduler, connection: redis });
    return [scheduler, queueName] as const;
};

export const runScheduler = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const queueNames = [config.queue.names.importInstagramUser, config.queue.names.enqueueImport];
    const scheduler = new QueueSchedulersWrapper(queueNames.map((queueName) => schedulerFactory(container, queueName)));
    await scheduler.waitUntilReady();
    container.register(QueueSchedulersWrapper, { useValue: scheduler });
    return scheduler;
};

export const shutDownScheduler = async (container: DependencyContainer) => {
    const scheduler = container.resolve(QueueSchedulersWrapper);
    await scheduler.close();
};

type QueueSchedulerTuple = readonly [scheduler: QueueScheduler, queueName: string];
type QueueSchedulers = readonly QueueSchedulerTuple[];
export class QueueSchedulersWrapper {
    public constructor(public schedulers: QueueSchedulers) {}
    public async waitUntilReady() {
        const logger = getAppLogger();
        return await Promise.all(
            this.schedulers.map(([scheduler, queueName]) =>
                scheduler
                    .waitUntilReady()
                    .then(() => logger.info({ queueName }, `Running QueueScheduler on ${queueName}`)),
            ),
        );
    }
    public async close() {
        const logger = getAppLogger();
        return await Promise.all(
            this.schedulers.map(([scheduler, queueName]) =>
                scheduler
                    .close()
                    .then(() => logger.info({ queueName }, `Closed QueueScheduler on ${queueName}`)),
            ),
        );
    }
}
