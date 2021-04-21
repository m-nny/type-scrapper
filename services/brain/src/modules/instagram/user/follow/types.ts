import { TListPageResult } from '../../../common/type';
import { TInstagramUserKey } from '../InstagramUser';

export type CreateIfNeeded = {
    create?: boolean;
};

export type AddFollowedByArgs = {
    username: string;
    followedBy: string[];
} & CreateIfNeeded;

export type AddFollowingArgs = {
    username: string;
    following: string[];
} & CreateIfNeeded;

export type TInstagramUserFollowerCount = TInstagramUserKey & {
    followersCount: number;
};
export type TInstagramUserFollowerCountList = TListPageResult<TInstagramUserFollowerCount>;
