import { configUtils, defaultLoggerOptions } from '@app/common';
import { AppEnv, ConfigShapeFrom, PartialConfigShape, PlainConfigShape } from '@app/common/dist/config/types';
import { JobsOptions } from 'bullmq';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    port: configUtils.number(3002),
    rootPrefix: configUtils.string(''),
    cors: {
        origin: configUtils.array(['*']),
        methods: configUtils.array(['GET', 'POST']),
    },
    ...defaultLoggerOptions,
    adminPanel: {
        endpoint: '/admin',
    },
    queue: {
        connection: {
            host: configUtils.string('localhost'),
            port: configUtils.number(6379),
        },
        names: {
            importInstagramUser: configUtils.string('import_insta_user'),
            enqueueImport: configUtils.string('enqueue_import'),
        },
        jobOptions: {
            attempts: configUtils.number(3),
            backoff: {
                type: configUtils.string('exponential'),
                delay: configUtils.number(1000),
            },
        } as ConfigShapeFrom<JobsOptions>,
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
