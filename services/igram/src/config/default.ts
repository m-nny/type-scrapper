import {
    AppEnv,
    ConfigShapeFrom,
    configUtils,
    defaultLoggerOptions,
    PartialConfigShape,
    PlainConfigShape
} from '@app/common';
import { IRateLimiterOptions } from 'rate-limiter-flexible';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    port: configUtils.number(3003),
    rootPrefix: configUtils.string(''),
    ...defaultLoggerOptions,
    cors: {
        origin: configUtils.array(['*']),
        methods: configUtils.array(['GET', 'POST']),
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
        rateLimiter: {
            keyPrefix: configUtils.string('igram-client'),
            points: configUtils.number(1),
            duration: configUtils.number(1),
        } as ConfigShapeFrom<IRateLimiterOptions>,
    },
    apollo: {
        cacheControl: configUtils.boolean(true),
    },
});
export type RootConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<RootConfigShape>;
export type PartialConfig = PartialConfigShape<RootConfigShape>;
