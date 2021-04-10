export const appEnvs = ['dev', 'k8s', 'compose', 'test'] as const;
export type AppEnv = typeof appEnvs[number];
export type Overrider<T> = (value: string | undefined) => T;
export type ConfigConstant = string | number | boolean | string[];
export type ConfigShape = {
    [key: string]: Overrider<ConfigConstant> | ConfigConstant | ConfigShape;
};
export type RootConfigShape = ConfigShape & { env: AppEnv };
export type AppEnvConfigShape<Config extends RootConfigShape> = PartialConfigShape<Config>;

export const createConfig = <T extends RootConfigShape>(config: T): T => config;
export const createConfigPart = <T extends ConfigShape>(config: T): T => config;
export const createAppEnvConfig = <T extends RootConfigShape>(config: AppEnvConfigShape<T>): AppEnvConfigShape<T> =>
    config;

// prettier-ignore
export type PlainConfigShape<Config extends ConfigShape> = {
    [K in keyof Config]:
        Config[K] extends ConfigConstant ? Config[K] :
        Config[K] extends Overrider<infer T>? T :
        Config[K] extends ConfigShape ? PlainConfigShape<Config[K]> :
        never;
};

// prettier-ignore
export type PartialConfigShape<Config extends ConfigShape> = {
    [K in keyof Config]?:
        Config[K] extends ConfigConstant ? Config[K] :
        Config[K] extends Overrider<infer T> ? T :
        Config[K] extends ConfigShape ? PartialConfigShape<Config[K]>:
        never;
};
// import * as cfgVar from './cfgVar';
// (() => {
//     const defaultConfig = createConfig({
//         env: 'dev' as AppEnv,
//         string: cfgVar.string('123'),
//         number: cfgVar.number(123),
//         boolean: cfgVar.boolean(false),
//         object: {
//             string: cfgVar.string('123'),
//         },
//     });
//     const prodConfig = createPartialConfig<typeof defaultConfig>({
//         env: 'prod',
//         number: 1,
//         object: {
//             string: '124',
//         },
//     });
// })();
