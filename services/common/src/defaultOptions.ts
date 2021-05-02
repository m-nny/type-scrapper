import * as configUtils from './config';
import { RetryArgs } from './retry';

export const defaultOptions = {
    retry: configUtils.createConfigPartFrom<RetryArgs>({
        decay: configUtils.number(2),
        retries: configUtils.number(2),
        timeout: configUtils.number(1),
    }),
};
