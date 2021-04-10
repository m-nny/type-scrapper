import _ from 'lodash';
export const okResult = { status: 'ok' } as const;
export const resultOkResult = () => okResult;
export type OkResult = typeof okResult;
export const isOkResult = (obj: any): obj is OkResult =>
    !_.isNull(obj) && !_.isUndefined(obj) && _.isString(obj.status) && obj.status === 'ok';


