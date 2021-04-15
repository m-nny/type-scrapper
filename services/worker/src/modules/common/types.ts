import { DependencyContainer } from 'tsyringe';

export type WorkerRunner = (container: DependencyContainer) => Promise<void>;

export const workerRoles = ['worker', 'admin-panel'] as const;
export type WorkerRole = typeof workerRoles[number];
