import { instagramResolvers } from './instagram/profile';

export const resolvers = [...instagramResolvers] as const;
