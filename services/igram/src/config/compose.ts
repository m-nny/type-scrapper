import { configUtils } from '@app/common';
import { RootConfigShape } from './default';

export const composeConfig = configUtils.createAppEnvConfig<RootConfigShape>({
    env: 'compose',
    cors: {
    },
});
