import { AsyncResult, isResultError } from '@app/models';
import { RetryArgs, sleepFor } from '../retry';

export type RetryAsyncResultCallback<T, P = unknown> = (retriesLeft: number) => AsyncResult<T, P>;

export const retryAsyncResult = async <D, P>(
    callback: RetryAsyncResultCallback<D, P>,
    { decay, timeout, retries }: RetryArgs,
): AsyncResult<D, P> => {
    const data = await callback(retries);
    if (!isResultError(data) || retries <= 0) {
        return data;
    }
    if (data.code !== 'NETWORK') {
        return data;
    }
    console.error(`Function ${callback.name} failed. Retrying ${retries} more times in ${timeout} secs`, data);
    await sleepFor(timeout);
    retries--;
    timeout *= decay;
    return retryAsyncResult(callback, { decay, timeout, retries });
};
