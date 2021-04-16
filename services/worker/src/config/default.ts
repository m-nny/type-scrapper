import { configUtils, defaultLoggerOptions } from '@m-nny/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@m-nny/common/dist/config/types';

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
    },
    instagram: {
        device: {
            seed: configUtils.string('seed'),
        },
        credentials: {
            username: configUtils.string('username'),
            password: configUtils.string('password'),
        }
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
