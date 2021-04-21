import { getAppLogger } from '@app/common';
import { Worker } from 'bullmq';
import { DependencyContainer } from 'tsyringe';
import { enqueueImportWorkerFactory } from '../EnqueueImport/worker';
import { importInstagramUserWorkerFactory } from '../ImportInstagramUser/worker';

export const runWorker = async (container: DependencyContainer) => {
    const factories = [importInstagramUserWorkerFactory, enqueueImportWorkerFactory];
    const workers = new WorkersWrapper(factories.map((factory) => factory(container)));
    await workers.waitUntilReady();
    container.register(WorkersWrapper, { useValue: workers });
    return workers;
};

export const shutDownWorker = async (container: DependencyContainer) => {
    const workers = container.resolve(WorkersWrapper);
    await workers.close();
};

type WorkerTuple = readonly [worker: Worker, queueName: string];
type Workers = readonly WorkerTuple[];

export class WorkersWrapper {
    public constructor(public workers: Workers) {}
    public async waitUntilReady() {
        const logger = getAppLogger();
        return await Promise.all(
            this.workers.map(([worker, queueName]) =>
                worker.waitUntilReady().then(() => logger.info({ queueName }, `Running worker on ${queueName}`)),
            ),
        );
    }
    public async close() {
        const logger = getAppLogger();
        return await Promise.all(
            this.workers.map(([worker, queueName]) =>
                worker.close().then(() => logger.info({ queueName }, `Closed worker on ${queueName}`)),
            ),
        );
    }
}
