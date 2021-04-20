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
