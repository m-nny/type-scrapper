import { AsyncResult, makeResultErrorOnReject } from '@m-nny/common/dist/axios';
import Instagram from 'instagram-web-api';
import { TInstagramConstructorArgs, TInstagramCredentials, TInstagramLoginOptions, TInstagramProfile } from './types';

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
}
