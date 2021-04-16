import { InstagramProfileResolver } from './profile/resolver';
import { InstagramUserResolver } from './user/resolver';

export const instagramResolvers = [InstagramProfileResolver, InstagramUserResolver] as const;
