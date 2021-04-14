import { InstagramUserKey } from './InstagramUser';

export class InstagramUserNotFoundError extends Error {
    public constructor(public searchKey: InstagramUserKey) {
        super('InstagramUser not found');
    }
}
