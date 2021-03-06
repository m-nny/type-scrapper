import { AppLogger, makeHttpLoggerMiddleware, makeLogger } from '@app/common';
import { AsyncOkResult, isResultError, makeResultError, okResult } from '@app/models';
import { ApolloServer } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import express from 'express';
import path from 'path';
import { Store } from 'tough-cookie';
import { FileCookieStore } from 'tough-cookie-file-store';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { ConfigWrapper, loadConfig, PartialConfig, PlainConfig } from './config';
import { resolvers } from './modules';
import { InstagramClient } from './modules/instagram/client';

const makeCookieStore = (config: PlainConfig, logger: AppLogger): Store | undefined => {
    if (config.instagram.cookie.disabled) {
        logger.info(config.instagram.cookie, 'Cookies are disabled');
        return undefined;
    }
    const cookieFilepath = path.resolve(config.instagram.cookie.path);
    const cookieJarStore = new FileCookieStore(cookieFilepath);

    logger.info({ cookieFilepath }, `Using cookie store`);
    return cookieJarStore;
};

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const logger = makeLogger(config);
    let cookieStore = makeCookieStore(config, logger);
    const instagramClient = new InstagramClient({ ...config.instagram.credentials, cookieStore }, logger, config.instagram.rateLimiter);
    container
        .register(AppLogger, { useValue: logger })
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(InstagramClient, { useValue: instagramClient });
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
        ...config.apollo,
        plugins: [responseCachePlugin],
    });
    const app = express();
    app.use(makeHttpLoggerMiddleware(config));
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
    if (!loggedIn.authenticated) {
        return makeResultError('INTERNAL_ERROR', 'Could not log in to instagram', { payload: loggedIn });
    }
    logger.info('Services initialized');
    return okResult;
};
