import { throwIfError } from '@app/models';
import { singleton } from 'tsyringe';
import { Arg, Args, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { CacheControl } from '../../graphql/cacheControl';
import { InstagramClient } from '../client';
import { TInstagramFollowers, TInstagramFollowings, TInstagramUser } from '../client/types';
import { InstagramPaginationArgs } from '../common/dto';
import { InstagramFollowers, InstagramFollowings, InstagramUser } from './dto';

@singleton()
@Resolver(InstagramUser)
export class InstagramUserResolver {
    public constructor(private client: InstagramClient) {}
    @Query(() => InstagramUser)
    @CacheControl({ maxAge: 60 })
    public async user(@Arg('username') username: string): Promise<TInstagramUser> {
        const user = await this.client.getUserByUsername({ username }).then(throwIfError);
        return user;
    }
    @FieldResolver(() => InstagramFollowers)
    @CacheControl({ maxAge: 60 })
    public async followers(
        @Root() user: InstagramUser,
        @Args() page: InstagramPaginationArgs,
    ): Promise<TInstagramFollowers> {
        const followers = await this.client.getFollowers({ userId: user.id, ...page }).then(throwIfError);
        return followers;
    }
    @FieldResolver(() => InstagramFollowings)
    public async followings(
        @Root() user: InstagramUser,
        @Args() page: InstagramPaginationArgs,
    ): Promise<TInstagramFollowings> {
        const followers = await this.client.getFollowings({ userId: user.id, ...page }).then(throwIfError);
        return followers;
    }
}
