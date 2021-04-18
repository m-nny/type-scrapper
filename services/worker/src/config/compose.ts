import { configUtils } from '@app/common';
import { ConfigShape } from './default';

export const composeConfig = configUtils.createAppEnvConfig<ConfigShape>({
    env: 'compose',
    queue: {
        connection: {
            host: 'redis',
        },
    },
});
