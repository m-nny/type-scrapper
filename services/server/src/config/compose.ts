import { configUtils } from '@app/common';
import { ConfigShape } from './default';

export const composeConfig = configUtils.createAppEnvConfig<ConfigShape>({
    env: 'compose',
    cors: {
    },
    pg: {
        host: 'db',
        port: 5432,
    },
    typeorm: {
        synchronize: false,
        migrationsRun: true,
    },
});
