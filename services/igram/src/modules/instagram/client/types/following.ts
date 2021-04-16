import { TInstagramList } from './common';
import { TInstagramFollower } from './followers';

export type TInstagramFollowings = TInstagramList<TInstagramFollowing>;
export type TInstagramFollowing = TInstagramFollower;
