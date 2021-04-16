import { AppLogger } from '@m-nny/common';
import { isResultError, ResultError2 } from '@m-nny/common/src/axios';
import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, initializeServices } from './app';
import { ImportInstagramUserWorker } from './modules/ImportInstagramUser/worker';

const runWorker = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.waitUntilReady();
    logger.info('Worker is ready');
};

const runApp = async () => {
    const container = await configureContainer();
    const isInitialized = await initializeServices(container);
    const logger = container.resolve(AppLogger);
    if (isResultError(isInitialized)) {
        throw new ResultError2(isInitialized);
    }
    logger.info(isInitialized, 'Modules initialized');
    return runWorker(container);
};

runApp();
