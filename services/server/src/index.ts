import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp } from './app';
import { ConfigWrapper } from './config';

const runExpress = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const app = createExpressApp(container);
    return app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
    });
};
configureContainer().then(runExpress);