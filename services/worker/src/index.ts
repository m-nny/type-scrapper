import 'reflect-metadata';
import { configureContainer } from './app';
import { ConfigWrapper } from './config';
import { runScheduler } from './modules/queue/scheduler';
import { runWorker } from './modules/queue/worker';

const runApp = async () => {
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
    return [worker, scheduler] as const;
};

runApp();
