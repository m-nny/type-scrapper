import { EnqueueImportResolver } from './instagram/enqueueImport/resolver';
import { ImportInstagramUserResolver } from './instagram/importUser/resolver';

export const resolvers = [ImportInstagramUserResolver, EnqueueImportResolver] as const;

export { useQueues } from './queues';
