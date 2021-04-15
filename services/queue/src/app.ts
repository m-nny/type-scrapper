import { AppLogger, makeLogger } from '@m-nny/common';
import { ApolloServer } from 'apollo-server-express';
import { router } from 'bull-board';
import express from 'express';
import Redis from 'ioredis';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { resolvers, useQueues } from './modules';
import { RedisWrapper } from './modules/utils/wrappers';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const redis = new Redis(config.queue.connection);
    redis.on('error', (err) => {
        logger.error(err, 'REDIS: FAILED');
        process.exit(0);
    });
    const logger = makeLogger(config);
    return container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(RedisWrapper, { useValue: new RedisWrapper(redis) })
        .register(AppLogger, { useValue: logger });
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
    useQueues(container);
    app.use(config.adminPanel.endpoint, router);
    apolloServer.applyMiddleware({ app, cors: config.cors });
    return app;
};
