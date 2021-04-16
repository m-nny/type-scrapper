import { throwIfError } from '@m-nny/common/dist/axios';
import { singleton } from 'tsyringe';
import { Arg, Query, Resolver } from 'type-graphql';
import { InstagramClient } from '../client';
import { InstagramUser, TPartialInstagramUser } from './dto';

@singleton()
@Resolver(InstagramUser)
export class InstagramUserResolver {
    public constructor(private client: InstagramClient) {}
    @Query(() => InstagramUser)
    public async user(@Arg('username') username: string): Promise<TPartialInstagramUser> {
        const user = await this.client.getUserByUsername({ username }).then(throwIfError);
        return user;
    }
}
