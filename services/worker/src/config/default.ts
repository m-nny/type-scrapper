import { configUtils, defaultLoggerOptions, defaultOptions } from '@app/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@app/common/dist/config/types';
import { WorkerRole } from '../modules/common/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    ...defaultLoggerOptions,
    queue: {
        connection: {
            host: configUtils.string('localhost'),
            port: configUtils.number(6379),
        },
        names: {
            importInstagramUser: configUtils.string('import_insta_user'),
            enqueueImport: configUtils.string('enqueue_import'),
        },
        role: configUtils.string<WorkerRole>('both'),
    },
    microservice: {
        brain: {
            hostname: configUtils.string('localhost'),
            port: configUtils.number(3001),
            endpoint: configUtils.string('/graphql'),
        },
        queue: {
            hostname: configUtils.string('localhost'),
            port: configUtils.number(3002),
            endpoint: configUtils.string('/graphql'),
        },
        instagram: {
            hostname: configUtils.string('localhost'),
            port: configUtils.number(3003),
            endpoint: configUtils.string('/graphql'),
        },
        retry: defaultOptions.retry,
    },
    worker: {
        concurrency: configUtils.number(2),
        limiter: {
            max: configUtils.number(10),
            duration: configUtils.number(1000),
        },
    },
    scheduler: {
        maxStalledCount: configUtils.number(1),
    },
    instagram: {
        maxFollowersNumber: configUtils.number(500),
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
