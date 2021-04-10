import { configUtils } from '@m-nny/common';
import { AppEnv, PartialConfigShape, PlainConfigShape } from '@m-nny/common/dist/config/types';

export const defaultConfig = configUtils.createConfig({
    env: 'dev' as AppEnv,
    port: configUtils.number(3002),
    rootPrefix: configUtils.string(''),
    cors: {
        origin: configUtils.string.array(['*']),
        methods: configUtils.string.array(['GET', 'POST']),
    },
    pg: {
        host: configUtils.string('localhost'),
        port: configUtils.number(9002),
        username: configUtils.string('aero'),
        password: configUtils.string('change-in-production'),
        database: configUtils.string('student_db'),
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
    auth: {
        disabled: configUtils.boolean(false),
        jwt: {
            secret: configUtils.string('change-in-production'),
            expiresIn: configUtils.string('30 days'),
            issuer: configUtils.string('aero-ent'),
            ignoreExpiration: configUtils.boolean(false),
        },
    },
    override: {
        testCenter: {
            cameraHostname: configUtils.string('10.200.1.1:60081'),
        },
    },
    retries: {
        timeout: configUtils.number(5),
    },
    exam: {
        estimatedDuration: configUtils.number(4 * 60 * 60), // in seconds
    },
});
export type ConfigShape = typeof defaultConfig;
export type PlainConfig = PlainConfigShape<ConfigShape>;
export type PartialConfig = PartialConfigShape<ConfigShape>;
