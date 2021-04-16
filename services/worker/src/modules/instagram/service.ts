import { AppLogger } from '@m-nny/common';
import { AsyncOkResult, AsyncResult, isResultError, makeResultErrorOnReject, okResult } from '@m-nny/common/src/axios';
import { AccountRepositoryLoginResponseLogged_in_user, IgApiClient } from 'instagram-private-api';
import { singleton } from 'tsyringe';
import { ConfigWrapper } from '../../config';
type LoggedInUser = AccountRepositoryLoginResponseLogged_in_user;

@singleton()
export class InstagramService {
    private client;
    private config;
    private loggedInUser: AsyncResult<LoggedInUser>;

    public constructor({ config }: ConfigWrapper, private logger: AppLogger) {
        this.client = new IgApiClient();
        this.config = config;
        this.client.state.generateDevice(this.config.instagram.device.seed);
        this.loggedInUser = this.login();
    }
    public async initialize(): AsyncOkResult {
        const loggedInUser = await this.loggedInUser;
        if (isResultError(loggedInUser)) {
            return loggedInUser;
        }
        return okResult;
    }
    private async login(): AsyncResult<LoggedInUser> {
        // await this.client.simulate.preLoginFlow();
        const { username, password } = this.config.instagram.credentials;
        const loggedInUser = await this.client.account.login(username, password).catch(makeResultErrorOnReject());
        if (isResultError(loggedInUser)) {
            this.logger.error(loggedInUser, 'Could not login to Instagram');
            return loggedInUser;
        }
        // process.nextTick(async () => await this.client.simulate.postLoginFlow());
        return loggedInUser;
    }
    public async getProfileByUsername(username: string): AsyncResult<unknown> {
        const id = await this.client.user.getIdByUsername(username).catch(makeResultErrorOnReject());
        if (isResultError(id)) {
            return id;
        }
        return this.getProfileById(id);
    }
    public async getProfileById(id: number): AsyncResult<unknown> {
        const feed = await this.client.user.accountDetails(id).catch(makeResultErrorOnReject());
        return feed;
    }
}
