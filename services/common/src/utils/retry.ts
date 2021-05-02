export function sleepFor(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export type RetryArgs = { retries: number; timeout: number; decay: number };
export type RetryCallback<T> = (retriesLeft: number) => Promise<T>;

export const retryPromise = async <T>(
    callback: RetryCallback<T>,
    { decay, timeout, retries }: RetryArgs,
): Promise<T> => {
    try {
        const data = await callback(retries);
        return data;
    } catch (e) {
        if (retries <= 0) {
            throw e;
        }
        console.error(`Function ${callback.name} failed. Retrying ${retries} more times in ${timeout} secs`, e);
        await sleepFor(timeout);
        retries--;
        timeout *= decay;
        return retryPromise(callback, { decay, timeout, retries });
    }
};

export type FnWrapper = <T>(action: () => Promise<T>) => Promise<T>;
export const retryWrapper = (args: RetryArgs): FnWrapper => (fn) => retryPromise(fn, args);
