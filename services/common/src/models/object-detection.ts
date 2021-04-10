import _ from 'lodash';
import { ReportViolation } from './violation';

export type GetViolationsFromUrlDTS = { url: string };
export const isGetViolationsFromUrlDTS = (obj: any): obj is GetViolationsFromUrlDTS =>
    !_.isNull(obj) && !_.isUndefined(obj) && _.isString(obj.url);
export type GetViolationsFromUrlResult = ReportViolation[];
