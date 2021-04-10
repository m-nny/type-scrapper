import _ from 'lodash';
export const NILL = '00000000-0000-0000-0000-000000000000';
export const IIN_NILL = '00000000-0000-0000-0000-000000000000';
export const fake = (suffix: string | number) => replaceSuffix(NILL, suffix);
export const fakeIIN = (suffix: string | number) => replaceSuffix(IIN_NILL, suffix);

const replaceSuffix = (orig: string, suffix: string | number) => {
    if (_.isNumber(suffix)) {
        suffix = String(suffix);
    }
    return orig.slice(0, -suffix.length) + suffix;
};
