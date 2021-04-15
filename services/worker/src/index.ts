import { AppLogger } from '@m-nny/common';
import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, makeExpressApp } from './app';
import { ConfigWrapper } from './config';
import { ImportInstagramUserWorker } from './modules/ImportInstagramUser/worker';

const runWorker = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const worker = container.resolve(ImportInstagramUserWorker);
    await worker.waitUntilReady();
    logger.info('Worker is ready');
};
const runAdminPanel = async (container: DependencyContainer) => {
    const logger = container.resolve(AppLogger);
    const { config } = container.resolve(ConfigWrapper);
    const app = makeExpressApp(container);

    app.listen(config.port, () => {
        logger.info(`Admin panel is ready at http://localhost:${config.port}${config.adminPanel.endpoint}`);
    });
};

const runApp = async () => {
    const container = await configureContainer();
    const { config } = container.resolve(ConfigWrapper);
    if (config.role === 'worker') {
        return runWorker(container);
    }
    if (config.role === 'admin-panel') {
        return runAdminPanel(container);
    }
};

runApp();
