import { AppLogger } from '@app/common';
import { DependencyContainer } from 'tsyringe';
import { ImportInstagramUserWorker } from '../ImportInstagramUser/worker';

export const runWorker = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.waitUntilReady();
    const queueName = worker.queueName;
    logger.info({ queueName }, `Running worker on ${queueName}`);
    container.register(ImportInstagramUserWorker, { useValue: worker });
    return worker;
};

export const shutDownWorker = async (container: DependencyContainer) => {
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.close();
};
