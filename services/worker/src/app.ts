import { AppLogger, makeLogger } from '@m-nny/common';
import Redis from 'ioredis';
import { container as tsyringeContainer } from 'tsyringe';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';

export const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const redis = new Redis(config.queue.connection);
    const logger = makeLogger(config);
    return container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(AppLogger, { useValue: logger })
        .register(Redis, { useValue: redis });
};
