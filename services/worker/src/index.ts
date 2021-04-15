import { AppLogger } from '@m-nny/common';
import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer } from './app';
import { ImportInstagramUserWorker } from './modules/ImportInstagramUser/worker';

const runExpress = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.waitUntilReady();
    logger.info('Worker is ready');
};
configureContainer().then(runExpress);
