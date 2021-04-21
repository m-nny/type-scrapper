import { filterArray } from '../common/filters';

export const filterFollowings = ({ followings, ...rest }: GetAllUserFollowingsResult) => ({
    followings: filterArray(followings),
    ...rest,
});
export const filterFollowers = ({ followers, ...rest }: GetAllUserFollowersResult) => ({
    followers: filterArray(followers),
    ...rest,
});
export type GetAllUserFollowersResult = {
    count: number;
    followers: string[];
};
export type GetAllUserFollowingsResult = {
    count: number;
    followings: string[];
};