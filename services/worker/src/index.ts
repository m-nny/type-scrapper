import 'reflect-metadata';
import { AppLogger } from '@m-nny/common';
import { DependencyContainer } from 'tsyringe';
import { configureContainer } from './app';
import { ImportInstagramUserWorker } from './modules/ImportInstagramUser/worker';

const runWorker = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.waitUntilReady();
    logger.info('Worker is ready');
};

const runApp = async () => {
    const container = await configureContainer();
    return runWorker(container);
};

runApp();
