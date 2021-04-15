import { ImportInstagramUserResolver } from './instagram/importUser/resolver';

export const resolvers = [ImportInstagramUserResolver] as const;

export { useQueues } from './queues';
