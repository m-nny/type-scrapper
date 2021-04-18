import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp } from './app';
import { ConfigWrapper } from './config';

const runExpress = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const app = await createExpressApp(container);
    return app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
        console.log(`http://localhost:${config.port}/graphql`);
    });
};
configureContainer().then(runExpress);
