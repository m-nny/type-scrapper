import { AppLogger, makeLogger } from '@m-nny/common';
import { router } from 'bull-board';
import express from 'express';
import Redis from 'ioredis';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { useQueues } from './modules';
import { RedisWrapper } from './modules/utils/wrappers';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const redis = new Redis(config.queue.connection);
    const logger = makeLogger(config);
    return container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(RedisWrapper, { useValue: new RedisWrapper(redis) })
        .register(AppLogger, { useValue: logger });
};

export const makeExpressApp = (container: DependencyContainer) => {
    const { config } = container.resolve(ConfigWrapper);
    useQueues(container);
    const app = express();
    app.use(config.adminPanel.endpoint, router);
    return app;
};
