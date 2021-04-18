import { QueueScheduler } from 'bullmq';
import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
import { configureContainer, configureShutdown } from './app';
import { ConfigWrapper } from './config';
import { ImportInstagramUserWorker } from './modules/ImportInstagramUser/worker';
import { runScheduler, shutDownScheduler } from './modules/queue/scheduler';
import { runWorker, shutDownWorker } from './modules/queue/worker';

type Args = {
    container: DependencyContainer;
    worker: ImportInstagramUserWorker | undefined;
    scheduler: QueueScheduler | undefined;
};
const runApp = async (): Promise<Args> => {
    const container = await configureContainer();
    const { config } = container.resolve(ConfigWrapper);
    const role = config.queue.role;
    let worker;
    if (role === 'worker' || role === 'both') {
        worker = await runWorker(container);
    }
    let scheduler;
    if (role === 'scheduler' || role === 'both') {
        scheduler = await runScheduler(container);
    }
    return { container, worker, scheduler };
};

const handleShutdown = async (args: Args) => {
    const { worker, scheduler } = args;
    configureShutdown(container, () => {
        if (worker) {
            shutDownWorker(container);
        }
        if (scheduler) {
            shutDownScheduler(container);
        }
    });
    return args;
};

runApp().then(handleShutdown);
