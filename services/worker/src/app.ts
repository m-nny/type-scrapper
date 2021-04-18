import { AppLogger, makeLogger } from '@app/common';
import Redis from 'ioredis';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
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

export const configureShutdown = (container: DependencyContainer, onShutdown: () => void) => {
    const logger = container.resolve(AppLogger);
    const shutDown = () => {
        logger.info('App is shutting down');
        onShutdown();
    };
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
};
