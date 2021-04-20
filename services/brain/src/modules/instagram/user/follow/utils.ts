import { InstagramUserKey } from '../InstagramUser';

const hydrateUsername = (username: string): InstagramUserKey => ({ username });
const hydrateUsernames = (usernameList: string[]): InstagramUserKey[] => usernameList.map(hydrateUsername);

export const hydrate = {
    username: hydrateUsername,
    usernames: hydrateUsernames,
};
