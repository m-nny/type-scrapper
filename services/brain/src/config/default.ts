import { configUtils } from '@app/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@app/common/dist/config/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    port: configUtils.number(3001),
    rootPrefix: configUtils.string(''),
    cors: {
        origin: configUtils.string.array(['*']),
        methods: configUtils.string.array(['GET', 'POST']),
    },
    pg: {
        host: configUtils.string('localhost'),
        port: configUtils.number(9001),
        username: configUtils.string('m-nny'),
        password: configUtils.string('change-in-production'),
        database: configUtils.string('scrapper'),
        ssl: {
            disabled: configUtils.boolean(true),
            ca: configUtils.string(''),
        },
    },
    typeorm: {
        disabled: configUtils.boolean(false),
        logging: configUtils.boolean(true),
        synchronize: configUtils.boolean(true),
        migrationsRun: configUtils.boolean(false),
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
