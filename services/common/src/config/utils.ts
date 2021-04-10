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

export const parseArray = <T = string>(json: string, validator: (val: T) => boolean = _.isString): T[] | undefined => {
    let array: unknown;
    try {
        array = JSON.parse(json);
    } catch (e) {
        console.error('JSON is invalid ', json);
        return undefined;
    }
    if (_.isArray(array) && array.every(validator)) {
        return array;
    }
    return undefined;
};
