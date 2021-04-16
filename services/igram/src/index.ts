import { AsyncOkResult, isResultError, okResult, throwIfError } from '@m-nny/common/dist/axios';
import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp, initializeServices } from './app';
import { ConfigWrapper } from './config';
import './types/modules';

const runExpress = async (container: DependencyContainer): AsyncOkResult => {
    const { config } = container.resolve(ConfigWrapper);
    const isInitialized = await initializeServices(container);
    if (isResultError(isInitialized)) {
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
