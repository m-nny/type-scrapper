import { AppLogger, makeHttpLoggerMiddleware, makeLogger } from '@app/common';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { Connection, useContainer as useContainerForTypeOrm } from 'typeorm';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { resolvers } from './modules';
import { makeTypeORMConnection } from './modules/typeorm';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const logger = makeLogger(config);
    container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(AppLogger, { useValue: logger });
    if (!config.typeorm.disabled) {
        const connection = await makeTypeORMConnection(config);
        container.register(Connection, { useValue: connection });
    }
    return container;
};

export const createExpressApp = async (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    const schema = await buildSchema({
        resolvers,
        container: { get: (x) => container.resolve(x as any) },
    });
    const apolloServer = new ApolloServer({
        schema,
    });
    const app = express();
    useContainerForTypeOrm({ get: (x) => container.resolve(x as any) }, { fallback: false, fallbackOnErrors: false });
    app.use(makeHttpLoggerMiddleware(config));
    apolloServer.applyMiddleware({ app });
    return app;
};
