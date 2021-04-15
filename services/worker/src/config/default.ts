import { configUtils, defaultLoggerOptions } from '@m-nny/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@m-nny/common/dist/config/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    logger: {
        ...defaultLoggerOptions
    },
    queue: {
        connection: {
            hostname: configUtils.string('localhost'),
            port: configUtils.number(6379),
        },
        names: {
            importInstagramUser: configUtils.string('import_insta_user'),
        },
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
