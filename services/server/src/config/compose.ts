import { configUtils } from '@m-nny/common';
import { ConfigShape } from './default';

export const composeConfig = configUtils.createAppEnvConfig<ConfigShape>({
    env: 'compose',
    cors: {
        origin: ['https://ent.aeroexam.org'],
    },
    auth: {
        disabled: false,
        jwt: {
            ignoreExpiration: false,
        },
    },
    pg: {
        host: 'student_db',
        port: 5432,
    },
    typeorm: {
        synchronize: false,
        migrationsRun: true,
    },
});
