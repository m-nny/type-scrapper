export const sleepFor = (seconds: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export type RetryArgs = { retries: number; timeout: number; decay: number };
export type RetryFn<T> = (retriesLeft: number) => Promise<T>;

export const retryPromise = async <T>(fn: RetryFn<T>, { decay, timeout, retries }: RetryArgs): Promise<T> => {
    const fnName = fn.name || 'anon';
    try {
        const data = await fn(retries);
        console.error(`Function ${fnName} finished`);
        return data;
    } catch (e) {
        if (retries <= 0) {
            throw e;
        }
        console.error(`Function ${fnName} failed. Retrying ${retries} more times in ${timeout} secs`, e);
        await sleepFor(timeout);
        retries--;
        timeout *= decay;
        return retryPromise(fn, { decay, timeout, retries });
    }
};

export type FnWrapper = <T>(action: () => Promise<T>) => Promise<T>;
export const retryWrapper = (args: RetryArgs): FnWrapper => (fn) => retryPromise(fn, args);
