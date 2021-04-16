import { AsyncResult, makeResultErrorOnReject } from '@m-nny/common/dist/axios';
import Instagram from 'instagram-web-api';
import {
    TInstagramConstructorArgs,
    TInstagramCredentials,
    TInstagramGetUserByUsername,
    TInstagramLoginOptions,
    TInstagramProfile, TInstagramUser
} from './types';

export class InstagramClient {
    private client;
    public constructor(args: TInstagramConstructorArgs) {
        this.client = new Instagram(args);
    }
    public login(credentials: TInstagramCredentials, opts: TInstagramLoginOptions = {}): AsyncResult<unknown> {
        return this.client.login(credentials, opts).catch(makeResultErrorOnReject);
    }
    public logout(): AsyncResult<unknown> {
        return this.client.logout().catch(makeResultErrorOnReject);
    }
    public getProfile(): AsyncResult<TInstagramProfile> {
        return this.client.getProfile();
    }
    public getUserByUsername({ username }: TInstagramGetUserByUsername): AsyncResult<TInstagramUser> {
        return this.client.getUserByUsername({ username });
    }
}
