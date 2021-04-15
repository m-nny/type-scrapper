import { BullMQAdapter, setQueues } from 'bull-board';
import { DependencyContainer } from 'tsyringe';
import { makeInstagramUserQueue } from './ImportInstagramUser/worker';

const queueFactories = [makeInstagramUserQueue];

export const useQueues = (container: DependencyContainer) => {
    const queueAdapters = queueFactories
        .map((queueFactory) => queueFactory(container))
        .map((queue) => new BullMQAdapter(queue));
    setQueues(queueAdapters);
};
