import { AppLogger, makeLogger } from '@m-nny/common';
import { AsyncOkResult, isResultError, okResult } from '@m-nny/common/dist/axios';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { resolvers } from './modules';
import { InstagramClient } from './modules/instagram/client';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const logger = makeLogger(config);
    return container
        .register(AppLogger, { useValue: logger })
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(InstagramClient, { useValue: new InstagramClient(config.instagram.credentials) });
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
    apolloServer.applyMiddleware({ app });
    return app;
};

export const initializeServices = async (container: DependencyContainer): AsyncOkResult => {
    const { config } = container.resolve(ConfigWrapper);
    const logger = container.resolve(AppLogger);
    const instagramClient = container.resolve(InstagramClient);

    const loggedIn = await instagramClient.login(config.instagram.credentials);
    if (isResultError(loggedIn)) {
        return loggedIn;
    }
    logger.info('Services initialized');
    return okResult;
};
