import { AppLogger } from '@app/common';
import { AsyncResult, makeResultErrorOnReject } from '@app/common/dist/axios';
import Instagram from 'instagram-web-api';
import moment from 'moment';
import {
    TInstagramConstructorArgs,
    TInstagramCredentials,
    TInstagramFollowings,
    TInstagramLoginOptions,
    TInstagramPagination,
    TInstagramProfile,
    TInstagramUser,
    TInstagramUserId,
    TInstagramUsername
} from './types';
import { TInstagramFollowers } from './types/followers';

export class InstagramClient {
    private client;
    public constructor(args: TInstagramConstructorArgs, private logger: AppLogger) {
        this.client = new Instagram(args);
    }
    public login(credentials: TInstagramCredentials, opts: TInstagramLoginOptions = {}): AsyncResult<unknown> {
        return this.requestHelper(() => this.client.login(credentials, opts), 'login');
    }
    public logout(): AsyncResult<unknown> {
        return this.requestHelper(() => this.client.logout(), 'logout');
    }
    public getProfile(): AsyncResult<TInstagramProfile> {
        return this.requestHelper(() => this.client.getProfile(), 'getProfile');
    }
    public getUserByUsername(args: TInstagramUsername): AsyncResult<TInstagramUser> {
        return this.requestHelper(() => this.client.getUserByUsername(args), 'getUserByUsername');
    }
    public getFollowers(args: TInstagramUserId & TInstagramPagination): AsyncResult<TInstagramFollowers> {
        return this.requestHelper(() => this.client.getFollowers(args), 'getFollowers');
    }
    public getFollowings(args: TInstagramUserId & TInstagramPagination): AsyncResult<TInstagramFollowings> {
        return this.requestHelper(() => this.client.getFollowings(args), 'getFollowings');
    }

    private async requestHelper<T>(callback: () => AsyncResult<T>, name = 'anonymous'): AsyncResult<T> {
        const start = moment();
        const data = await callback().catch(makeResultErrorOnReject());
        const end = moment();
        const took = moment.duration(end.diff(start)).asSeconds();
        this.logger.debug({ end: end.unix(), start: start.unix() }, `Callback ${name} took ${took} seconds`);
        return data;
    }
}
