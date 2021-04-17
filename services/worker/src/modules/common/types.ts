import { DependencyContainer } from 'tsyringe';

export type WorkerRunner = (container: DependencyContainer) => Promise<void>;

export const workerRoles = ['worker', 'scheduler', 'both'] as const;
export type WorkerRole = typeof workerRoles[number];
