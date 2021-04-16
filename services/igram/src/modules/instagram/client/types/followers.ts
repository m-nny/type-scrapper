import { TInstagramEdge, TInstagramList } from './common';

export type TInstagramFollowers = TInstagramList<TInstagramFollower>;

export type TInstagramFollower = {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_verified: boolean;
    followed_by_viewer: boolean;
    requested_by_viewer: boolean;
};
