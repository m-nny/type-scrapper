import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { RetryArgs } from '../utils';
import { makeUrlMap, MakeUrlMapArg } from '../utils/url';
import { AsyncResult, getResultErrorCode, makeResultError, ResultError } from './result';
import { retryAsyncResult } from './retry';

export const axiosRequest = <T, E>(axios: AxiosInstance, config: AxiosRequestConfig): AsyncResult<T, E> =>
    axios
        .request<T>(config)
        .then((res) => res.data)
        .catch((e) => makeAxiosResultError(e));

export const axiosRequestWithRetry = async <T, D = unknown>(
    axios: AxiosInstance,
    config: AxiosRequestConfig,
    retryArgs: RetryArgs,
): AsyncResult<T, D> => retryAsyncResult(() => axiosRequest(axios, config), retryArgs);

const makeAxiosRequestWithRetry = (defaultConfig: AxiosRequestConfig, retryArgs: RetryArgs) => {
    const axios = Axios.create(defaultConfig);
    return <T, P = unknown>(requestConfig: AxiosRequestConfig) =>
        axiosRequestWithRetry<T, P>(axios, requestConfig, retryArgs);
};

export const makeMicroserviceApis = <M extends MakeUrlMapArg>(
    map: M,
    retryArgs: RetryArgs,
    config?: AxiosRequestConfig,
) => {
    const urlMap = makeUrlMap(map);
    return _.mapValues(urlMap, (baseURL) => makeAxiosRequestWithRetry({ ...config, baseURL }, retryArgs));
};

export const makeAxiosResultError = <E>(error: any): ResultError<E> => {
    if (Axios.isAxiosError(error)) {
        return makeResultError<E>(
            getResultErrorCode(error.response?.status),
            `Axios error happened: ${error.message}`,
            {
                error,
                payload: error.response?.data,
            },
        );
    }
    return makeResultError<E>('UNKNOWN', 'Unknown axios error happened', { error });
};

export * from './result';