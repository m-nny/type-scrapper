import { AppLogger, makeHttpLoggerMiddleware, makeLogger } from '@app/common';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { container as tsyringeContainer, DependencyContainer, instanceCachingFactory } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import {
    Connection,
    ConnectionManager,
    getConnection,
    getConnectionManager,
    useContainer as useContainerForTypeOrm,
} from 'typeorm';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { resolvers } from './modules';
import { useAdminBro } from './modules/admin/bro';
import { makeTypeORMConnection } from './modules/typeorm';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const container = tsyringeContainer.createChildContainer();
    const config = loadConfig(configOverride);
    const logger = makeLogger(config);
    container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(AppLogger, { useValue: logger });
    if (!config.typeorm.disabled) {
        const manager = getConnectionManager();
        container.register(ConnectionManager, { useValue: manager });
        useContainerForTypeOrm(
            { get: (x) => container.resolve(x as any) },
            { fallback: false, fallbackOnErrors: false },
        );
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
    const connection = getConnection();
    app.use(makeHttpLoggerMiddleware(config));
    await useAdminBro(container, app, connection);
    apolloServer.applyMiddleware({ app });
    return app;
};
