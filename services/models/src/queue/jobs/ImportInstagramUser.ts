import { isEnumFactory } from '../../helpers';

// ImportInstagramUser

export const importInstagramUserJobs = ['getUserProfile', 'getUserFollowers', 'getUserFollowings'] as const;
export type ImportInstagramUserJob = typeof importInstagramUserJobs[number];
export const isImportInstagramUserJob = isEnumFactory(importInstagramUserJobs);

export type ImportInstagramUserData = {
    username: string;
    cursor?: string;
};
