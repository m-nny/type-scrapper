export const appEnvs = ['dev', 'k8s', 'compose', 'test'] as const;
export type AppEnv = typeof appEnvs[number];
export type Overrider<T> = (value: string | undefined) => T;
export type ArrayOverrider<T> = Overrider<Array<T> | Array<Record<string , T> >| null>;
export type ConfigConstant = string | number | boolean | null;
export type ConfigShape = {
    [key: string]:
        | Overrider<ConfigConstant>
        | ArrayOverrider<ConfigConstant>
        | ConfigConstant
        | ConfigShape;
};
export type RootConfigShape = ConfigShape & { env: AppEnv };
export type AppEnvConfigShape<Config extends RootConfigShape> = PartialConfigShape<Config>;

export const createConfig = <T extends RootConfigShape>(config: T): T => config;
export const createConfigPart = <T extends ConfigShape>(config: T): T => config;
export const createConfigPartFrom = <T>(config: ConfigShapeFrom<T>): ConfigShapeFrom<T> => config;
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
        Config[K] extends Array<ConfigShape> ? Array<PartialConfigShape<Config[K][number]>> :
        Config[K] extends ConfigShape ? PartialConfigShape<Config[K]>:
        never;
};

// prettier-ignore
export type ConfigShapeFrom<Object> = {
    [K in keyof Object]-?:
        Object[K] extends ConfigConstant ? Overrider<Object[K]> :
        NonNullable<Object[K]> extends ConfigConstant ? Overrider<NonNullable<Object[K]>> :
        Object[K] extends Record<string, any> ? ConfigShapeFrom<Object[K]> : 
        never;
}

// import _ from 'lodash';
// import * as cfgVar from './cfgVar';
// (() => {
//     type Sentinel = { host: string; port: number };
//     const isSentinel = (obj: any): obj is Sentinel => _.isString(obj?.host) && _.isInteger(obj?.port);
//     const defaultConfig = createConfig({
//         env: 'dev' as AppEnv,
//         string: cfgVar.string('123'),
//         number: cfgVar.number(123),
//         boolean: cfgVar.boolean(false),
//         object: {
//             string: cfgVar.string('123'),
//         },
//         arrayString: cfgVar.array([], isSentinel),
//         undefinedArrayString: cfgVar.array.orNull(null, isSentinel),
//     });
//     const k8sConfig = createAppEnvConfig<typeof defaultConfig>({
//         env: 'k8s',
//         number: 1,
//         object: {
//             string: '124',
//         },
//         arrayString: [{ host: '', port: 2 }],
//     });
// })();
