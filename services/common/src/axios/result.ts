import _, { isNumber, isString } from 'lodash';
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

export const okResult = { result: 'ok' } as const;
export type OkResult = typeof okResult;

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
    if (status === 400) return 'BAD_REQUEST';
    if (status === 401) return 'UNAUTHORIZED';
    if (status === 403) return 'FORBIDDEN';
    if (status === 404) return 'NOT_FOUND';
    if (status === 429) return 'TOO_MANY_REQUESTS';
    if (status === 500) return 'INTERNAL_ERROR';
    return 'UNKNOWN';
};

export const throwIfError = <D, P>(result: Result<D, P>): D => {
    console.log(result);
    if (isResultError(result)) {
        throw new ResultError2(result);
    }
    return result;
};

type MakeResultErrorOnRejectArg = {
    message?: string;
    code?: ResultErrorCode;
};
export const makeResultErrorOnReject = ({ code, message }: MakeResultErrorOnRejectArg = {}) => <P>(
    error: any,
): ResultError<P> => {
    if (isString(error?.message)) {
        message = error.message;
    }
    if (isNumber(error?.code)) {
        code = code ?? getResultErrorCode(error.code);
    }
    if (isNumber(error?.response?.statusCode)) {
        code = code ?? getResultErrorCode(error.response.statusCode);
    }
    // console.log('makeResultErrorOnReject', error?.code, error?.response?.statusCode, error);
    return makeResultError(code ?? 'UNKNOWN', message ?? 'unknown error happened', { error });
};
export class ResultError2<P> extends Error {
    public constructor(public error: ResultError<P>) {
        super(error.message);
    }
}
