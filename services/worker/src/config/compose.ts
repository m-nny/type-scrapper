import { configUtils } from '@m-nny/common';
import { ConfigShape } from './default';

export const composeConfig = configUtils.createAppEnvConfig<ConfigShape>({
    env: 'compose',
    queue: {
        connection: {
            hostname: 'redis',
        },
    },
});
