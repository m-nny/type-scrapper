import { configUtils, defaultLoggerOptions } from '@app/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@app/common/dist/config/types';
import { WorkerRole } from '../modules/common/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    logger: {
        ...defaultLoggerOptions,
    },
    queue: {
        connection: {
            host: configUtils.string('localhost'),
            port: configUtils.number(6379),
        },
        names: {
            importInstagramUser: configUtils.string('import_insta_user'),
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
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
