import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { configureContainer, createExpressApp } from './app';
import { ConfigWrapper } from './config';

const runExpress = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const app = await createExpressApp(container);
    return app.listen(config.port, () => {
        console.log(`Server started on port ${config.port}`);
        console.log(`Graphql:    http://localhost:${config.port}/graphql`);
        console.log(`Metrics:    http://localhost:${config.port}/metrics`);
        console.log(`Admin pane: http://localhost:${config.port}${config.adminPanel.endpoint}`);
    });
};
configureContainer().then(runExpress);
