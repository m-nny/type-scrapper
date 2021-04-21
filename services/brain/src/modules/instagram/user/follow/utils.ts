import { TInstagramUserKey } from '../InstagramUser';

const hydrateUsername = (username: string): TInstagramUserKey => ({ username });
const hydrateUsernames = (usernameList: string[]): TInstagramUserKey[] => usernameList.map(hydrateUsername);

export const hydrate = {
    username: hydrateUsername,
    usernames: hydrateUsernames,
};
