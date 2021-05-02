import { Person } from './admin/bro';
import { instagramEntities, instagramResolvers } from './instagram';

export const entities = [...instagramEntities, Person];
export const migrations = [];

export const resolvers = [...instagramResolvers] as const;
