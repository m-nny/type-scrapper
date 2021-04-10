import { Overrider } from './types';
import { parseArray } from './utils';

export const number = (defaultValue: number) => (override: string | undefined) => {
    if (override) {
        const overrideValue = Number(override);
        if (!isNaN(overrideValue)) {
            return overrideValue;
        }
    }

    return defaultValue;
};
// TODO: грязно
export const string = <T = string>(defaultValue: T): Overrider<T> => {
    return (override: string | undefined) => {
        if (override !== undefined) {
            return (override as unknown) as T;
        }

        return (defaultValue as unknown) as T;
    };
};
export const stringArray = (defaultValue: string[]): Overrider<string[]> => (override: string | undefined) => {
    if (override !== undefined) {
        const array = parseArray(override);
        if (array) return array;
    }
    return defaultValue;
};
string.array = stringArray;
export const stringOrBoolean = <T extends string>(defaultValue: T | boolean): Overrider<T | boolean> => {
    return (override: string | undefined) => {
        if (override !== undefined) {
            if (override === 'true') {
                return true;
            } else if (override === 'false') {
                return false;
            }

            return (override as unknown) as T;
        }

        return (defaultValue as unknown) as T;
    };
};

export const boolean = (defaultValue: boolean): Overrider<boolean> => {
    return (override: string | undefined) => {
        if (override === 'true') {
            return true;
        } else if (override === 'false') {
            return false;
        }

        return defaultValue;
    };
};
