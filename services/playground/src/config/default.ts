import { configUtils, defaultLoggerOptions } from '@m-nny/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@m-nny/common/dist/config/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    port: configUtils.number(3003),
    rootPrefix: configUtils.string(''),
    logger: {
        ...defaultLoggerOptions,
    },
    cors: {
        origin: configUtils.string.array(['*']),
        methods: configUtils.string.array(['GET', 'POST']),
    },
    instagram: {
        credentials: {
            username: configUtils.string('username'),
            password: configUtils.string('password'),
        },
        cookie: {
            disabled: configUtils.boolean(false),
            path: configUtils.string('../../data/cookies/instagram.json'),
        },
    },
    apollo: {
        cacheControl: {
            enabled: configUtils.boolean(true),
            defaultMaxAge: configUtils.number(5),
        },
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
