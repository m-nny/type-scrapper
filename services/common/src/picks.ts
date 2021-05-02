import _ from 'lodash';

export const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> =>
    _.pick(obj, keys) as any;
export const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> =>
    _.omit(obj, keys) as any;
export const split = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[],
): [Pick<T, K>, Omit<T, K>] => [pick(obj, keys), omit(obj, keys)];
