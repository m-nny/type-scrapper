import { AppLogger } from '@app/common';
import { AsyncResult, isResultError, makeResultErrorOnReject } from '@app/models';
import Instagram from 'instagram-web-api';
import moment from 'moment';
import { IRateLimiterOptions, RateLimiterMemory } from 'rate-limiter-flexible';
import {
    TInstagramConstructorArgs,
    TInstagramCredentials,
    TInstagramFollowings,
    TInstagramLoginOptions,
    TInstagramLoginResult,
    TInstagramPagination,
    TInstagramProfile,
    TInstagramUser,
    TInstagramUserId,
    TInstagramUsername
} from './types';
import { TInstagramFollowers } from './types/followers';

export class InstagramClient {
    private client;
    private rateLimiter;
    public constructor(args: TInstagramConstructorArgs, private logger: AppLogger, rateLimiterOptions: IRateLimiterOptions) {
        this.client = new Instagram(args);
        this.rateLimiter = new RateLimiterMemory(rateLimiterOptions);
    }
    public login(
        credentials: TInstagramCredentials,
        opts: TInstagramLoginOptions = {},
    ): AsyncResult<TInstagramLoginResult> {
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

    private async requestHelper<T>(callback: () => AsyncResult<T>, name: string): AsyncResult<T> {
        const pointsConsumed = await this.rateLimiter.consume(name, 1, {}).catch(
            makeResultErrorOnReject({
                code: 'TOO_MANY_REQUESTS',
                message: `Callback ${name} got too many requests`,
            }),
        );
        if (isResultError(pointsConsumed)) {
            return pointsConsumed;
        }
        const start = moment();
        const data = await callback().catch(makeResultErrorOnReject());
        const end = moment();
        const took = moment.duration(end.diff(start)).asSeconds();
        this.logger.debug(
            { end: end.unix(), start: start.unix(), pointsConsumed },
            `Callback ${name} took ${took} seconds`,
        );
        return data;
    }
}
