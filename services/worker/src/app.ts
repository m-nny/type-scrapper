import { AppLogger, getAppLogger, makeLogger, setAppLogger } from '@app/common';
import Redis from 'ioredis';
import _ from 'lodash';
import { container as tsyringeContainer, DependencyContainer } from 'tsyringe';
import { ConfigWrapper, loadConfig, PartialConfig } from './config';
import { QueueSchedulersWrapper, runScheduler, shutDownScheduler } from './modules/queue/scheduler';
import { runWorker, shutDownWorker, WorkersWrapper } from './modules/queue/worker';
import { RedisWrapper } from './modules/utils/wrappers';

const configureContainer = async (configOverride?: PartialConfig) => {
    const config = loadConfig(configOverride);
    const container = tsyringeContainer.createChildContainer();
    const redis = new Redis(config.queue.connection);
    const logger = makeLogger(config);
    setAppLogger(logger);
    container
        .register(ConfigWrapper, { useValue: new ConfigWrapper(config) })
        .register(RedisWrapper, { useValue: new RedisWrapper(redis) })
        .register(AppLogger, { useValue: logger });
    return container;
};

const configureShutdown = (container: DependencyContainer, onShutdown: () => Promise<void>) => {
    const { redis } = container.resolve(RedisWrapper);
    const logger = container.resolve(AppLogger);
    const shutDown = async () => {
        logger.info('App is shutting down');
        await onShutdown();
        process.exit(1);
    };
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
    redis.on('error', (err) => {
        logger.error(err, 'REDIS: FAILED');
        process.exit(1);
    });
};

export const runApp = async () => {
    const container = await configureContainer();
    const logger = container.resolve(AppLogger);
    const { config } = container.resolve(ConfigWrapper);
    const role = config.queue.role;
    let worker: WorkersWrapper | undefined;
    if (role === 'worker' || role === 'both') {
        worker = await runWorker(container);
    }
    let scheduler: QueueSchedulersWrapper | undefined;
    if (role === 'scheduler' || role === 'both') {
        scheduler = await runScheduler(container);
    }
    configureShutdown(container, async () => {
        if (worker) await shutDownWorker(container);
        if (scheduler) await shutDownScheduler(container);
    });
    logger.info('Worker is running');
};

export const handleFatalError = (error: any) => {
    const logger = getAppLogger();
    logger.error({ error: _.isError(error) ? error.message : error, isFatal: true }, 'Fatal error happened');
    console.error(error);
    process.exit(1);
};
