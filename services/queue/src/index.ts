import 'reflect-metadata';
import { AppLogger } from '@app/common';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp } from './app';
import { ConfigWrapper } from './config';

const runExpress = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);
    const app = await createExpressApp(container);
    return app.listen(config.port, () => {
        logger.info(`Server started on port ${config.port}`);
        logger.info(`http://localhost:${config.port}/graphql`);
        logger.info(`http://localhost:${config.port}${config.adminPanel.endpoint}`);
    });
};
configureContainer().then(runExpress);
