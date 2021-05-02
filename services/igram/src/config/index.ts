import { configUtils } from '@app/common';
import { composeConfig } from './compose';
import { defaultConfig, PlainConfig } from './default';

export { PartialConfig, PlainConfig, RootConfigShape } from './default';

export const loadConfig = configUtils.loadConfig(defaultConfig, { compose: composeConfig });
export class ConfigWrapper {
    public constructor(public config: PlainConfig) {}
}
