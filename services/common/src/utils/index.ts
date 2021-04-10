import _ from 'lodash';

function getFromEnv(name: string, or: string): string;
function getFromEnv(name: string, or: number): number;
function getFromEnv(name: string, or: string | number) {
    const fromEnv = process.env[name];
    if (!_.isUndefined(fromEnv) && _.isNumber(or)) {
        return _.toNumber(fromEnv);
    }
    if (!_.isUndefined(fromEnv) && _.isString(or)) {
        return fromEnv;
    }
    if (!_.isUndefined(fromEnv)) {
        return fromEnv;
    }
    return or;
}

export const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> =>
    _.pick(obj, keys) as any;
export const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> =>
    _.omit(obj, keys) as any;
export const split = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[],
): [Pick<T, K>, Omit<T, K>] => [pick(obj, keys), omit(obj, keys)];

export * from './retry';
export * from './types';
export * as url from './url';
export * as uuid from './uuid';
export * as s3 from './s3';
export * from './validators';
export { getFromEnv };
