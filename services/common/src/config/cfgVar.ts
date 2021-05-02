import _ from 'lodash';
import { Overrider } from './types';
import { parseArray, TypeValidator } from './utils';

export const number = (defaultValue: number): Overrider<number> => (override) => {
    if (override === undefined) {
        return defaultValue;
    }
    const overrideValue = _.toNumber(override);
    if (!isNaN(overrideValue)) {
        return overrideValue;
    }
    return defaultValue;
};

export const numberOrNull = (defaultValue: number | null): Overrider<number | null> => (override) => {
    if (override === undefined) {
        return defaultValue;
    }
    if (override === 'null' || override === null) {
        return null;
    }
    const overrideValue = _.toNumber(override);
    if (!isNaN(overrideValue)) {
        return overrideValue;
    }
    return defaultValue;
};
number.orNull = numberOrNull;

// TODO: грязно
export const string = <T = string>(defaultValue: T): Overrider<T> => (override) => {
    if (override !== undefined) {
        return (override as unknown) as T;
    }

    return (defaultValue as unknown) as T;
};

export const stringOrBoolean = <T extends string>(defaultValue: T | boolean): Overrider<T | boolean> => (override) => {
    if (override === undefined) {
        return defaultValue;
    }
    if (override === 'true') {
        return true;
    }
    if (override === 'false') {
        return false;
    }
    return override as T;
};
export const stringOrNull = <T extends string>(defaultValue: T | null): Overrider<T | null> => (override) => {
    if (override === undefined) {
        return defaultValue;
    }
    if (override === 'null' || override === null) {
        return null;
    }
    return override as T;
};
string.orNull = stringOrNull;

export const boolean = (defaultValue: boolean): Overrider<boolean> => (override) => {
    if (override === 'true') {
        return true;
    }
    if (override === 'false') {
        return false;
    }
    return defaultValue;
};

export const array = <T>(defaultValue: Array<T>, validator?: TypeValidator<T>): Overrider<Array<T>> => (override) => {
    if (override === undefined) {
        return defaultValue;
    }
    const array = parseArray(override, validator);
    if (array !== undefined) {
        return array;
    }
    return defaultValue;
};
