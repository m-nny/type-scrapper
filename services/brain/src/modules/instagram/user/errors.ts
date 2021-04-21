import { TInstagramUserKey } from './InstagramUser';

export class InstagramUserNotFoundError extends Error {
    public constructor(public searchKey: TInstagramUserKey) {
        super('InstagramUser not found');
    }
}
