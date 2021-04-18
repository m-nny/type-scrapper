import { AppLogger } from '@app/common';
import { Worker } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { importInstagramUserWorkerFactory } from '../ImportInstagramUser/worker';

export const runWorker = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const [worker, queueName] = importInstagramUserWorkerFactory(container);
    await worker.waitUntilReady();
    logger.info({ queueName }, `Running worker on ${queueName}`);
    container.register(Worker, { useValue: worker });
    return worker;
};

export const shutDownWorker = async (container: DependencyContainer) => {
    const worker = container.resolve(Worker);
    await worker.close();
};
