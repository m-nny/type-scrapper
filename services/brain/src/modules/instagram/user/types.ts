import { TListPage } from '../../common/type';

export type GetCoupleInstagramUsersArgs = {
    onlyNotImported?: boolean;
    page?: TListPage;
};

export type AddFollowedByArgs = {
    username: string;
    followedBy: string[];
};

export type AddFollowingArgs = {
    username: string;
    following: string[];
};
