import { InstagramImage } from './image/InstagramImage';
import { InstagramUserFollow } from './user/follow/InstagramUserFollow';
import { InstagramUserFollowResolver } from './user/follow/InstagramUserFollowResolver';
import { InstagramUser } from './user/InstagramUser';
import { InstagramUserInfo } from './user/InstagramUserInfo';
import { InstagramUserResolver } from './user/InstagramUserResolver';

export const instagramEntities = [InstagramUser, InstagramUserInfo, InstagramUserFollow, InstagramImage];
export const instagramResolvers = [InstagramUserResolver, InstagramUserFollowResolver] as const;
