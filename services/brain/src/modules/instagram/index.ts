import { InstagramImage } from './image/InstagramImage';
import { InstagramUser } from './user/InstagramUser';
import { InstagramUserResolver } from './user/InstagramUserResolver';

export const instagramEntities = [InstagramUser, InstagramImage];
export const instagramResolvers = [InstagramUserResolver] as const;
