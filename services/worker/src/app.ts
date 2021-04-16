import { AppLogger, makeLogger } from '@m-nny/common';
import { AsyncOkResult, isResultError, okResult } from '@m-nny/common/src/axios';
import Redis from 'ioredis';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { InstagramService } from './modules/instagram/service';
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

export const initializeServices = async (container: DependencyContainer): AsyncOkResult => {
    const instagramService = container.resolve(InstagramService);
    const instagramServiceReady = await instagramService.initialize();
    if (isResultError(instagramServiceReady)) {
        return instagramServiceReady;
    }
    return okResult;
};
