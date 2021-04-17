import { configUtils } from '@m-nny/common';
import { composeConfig } from './compose';
import { defaultConfig, PlainConfig } from './default';

export { ConfigShape, PartialConfig, PlainConfig } from './default';

export const loadConfig = configUtils.loadConfig(defaultConfig, { compose: composeConfig });
export class ConfigWrapper {
    public constructor(public config: PlainConfig) {}
}
