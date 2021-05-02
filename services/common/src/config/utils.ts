import fs from 'fs';
import _ from 'lodash';

export const loadStrFromFile = (filename: string): string | undefined => {
    try {
        const line = fs.readFileSync(filename, 'utf8');
        if (line.endsWith('\n')) {
            return line.slice(0, -1);
        }
        return line;
    } catch (e) {
        console.error(`[Warning] Error reading string from file ${filename}: `, e);
        return undefined;
    }
};

export type TypeValidator<T> = (val: any) => val is T;
export const parseArray = <T>(json: string, validator?: TypeValidator<T>): T[] | undefined => {
    let array: unknown;
    try {
        array = JSON.parse(json);
    } catch (e) {
        console.error('JSON is invalid ', json);
        return undefined;
    }
    if (_.isArray(array)) {
        if (validator === undefined || _.every(array, validator)) {
            return array;
        }
    }
    return undefined;
};
