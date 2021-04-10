import _ from 'lodash';
import { OkResult } from '../models';
export const resultErrorCodes = [
    'NOT_FOUND',
    'BAD_REQUEST',
    'FORBIDDEN',
    'INVALID_OPERATION',
    'INTERNAL_ERROR',
    'UNAUTHORIZED',
    'BANNED',
    'TOO_MANY_REQUESTS',
    'EXPIRED',
    'UNKNOWN',
    'PAYMENT_ERROR',
    'AGGREGATE_ERROR',
    'TIMEOUT',
    'NETWORK',
] as const;
export type ResultErrorCode = typeof resultErrorCodes[number];
export type ResultError<P = unknown> = {
    __error: true;
    code: ResultErrorCode;
    message: string;
    payload?: P;
    error?: any;
    retries?: number;
};
export type Result<D, P = unknown> = D | ResultError<P>;
export type AsyncResult<D, P = unknown> = Promise<Result<D, P>>;
export type AsyncOkResult = AsyncResult<OkResult>;

export const isResultError = <P>(result: any): result is ResultError<P> => _.isBoolean(result?.__error);
export const isResultSuccess = <D, P>(result: Result<D, P>): result is Result<D, P> => !isResultError(result);

export const makeResultError = <P>(
    code: ResultErrorCode,
    message: string,
    data: Pick<ResultError<P>, 'payload' | 'error' | 'retries'>,
): ResultError<P> => ({ __error: true, code, message, ...data });

export const getResultErrorCode = (status: number | undefined): ResultErrorCode => {
    if (status === undefined) return 'NETWORK';
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 404) return 'NOT_FOUND';
    if (status === 500) return 'INTERNAL_ERROR';
    return 'UNKNOWN';
};
