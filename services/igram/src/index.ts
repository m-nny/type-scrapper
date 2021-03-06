import 'reflect-metadata';
import 'apollo-cache-control';
import './types/modules';
import { AppLogger } from '@app/common';
import { AsyncOkResult, isResultError, okResult, throwIfError } from '@app/models';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp, initializeServices } from './app';
import { ConfigWrapper } from './config';

const runExpress = async (container: DependencyContainer): AsyncOkResult => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);
    const isInitialized = await initializeServices(container);
    if (isResultError(isInitialized)) {
        logger.error(isInitialized, 'initialization error');
        return isInitialized;
    }
    const app = await createExpressApp(container);
    app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
        console.log(`http://localhost:${config.port}/graphql`);
    });
    return okResult;
};

configureContainer().then(runExpress).then(throwIfError);
