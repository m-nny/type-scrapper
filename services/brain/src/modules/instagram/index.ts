import { InstagramImage } from './image/InstagramImage';
import { InstagramUser } from './user/InstagramUser';
import { InstagramUserInfo } from './user/InstagramUserInfo';
import { InstagramUserResolver } from './user/InstagramUserResolver';

export const instagramEntities = [InstagramUser, InstagramUserInfo, InstagramImage];
export const instagramResolvers = [InstagramUserResolver] as const;
