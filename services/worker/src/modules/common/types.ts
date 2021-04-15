import { DependencyContainer } from 'tsyringe';

export type WorkerRunner = (container: DependencyContainer) => Promise<void>;
