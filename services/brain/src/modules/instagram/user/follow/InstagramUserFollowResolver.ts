import { singleton } from 'tsyringe';
import { Args, FieldResolver, Int, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { ListPageArgs } from '../../../common/dto';
import { InstagramUserService } from '../InstagramUserService';
import { GetMostFollowedNotImportedUsers, InstagramUserFollowedByInput, InstagramUserFollowingInput } from './dto';
import { InstagramUserFollow, InstagramUserFollowList } from './InstagramUserFollow';
import { InstagramUserFollowService } from './InstagramUserFollowService';
import { TInstagramUserFollowerCountList } from './types';
import { hydrate } from './utils';

@singleton()
@Resolver(() => InstagramUserFollow)
export class InstagramUserFollowResolver implements ResolverInterface<InstagramUserFollow> {
    public constructor(
        private instagramUserFollowService: InstagramUserFollowService,
        private instagramUserService: InstagramUserService,
    ) {}
    @Query(() => InstagramUserFollowList)
    public async instagramFollows(@Args() page: ListPageArgs): Promise<InstagramUserFollowList> {
        return await this.instagramUserFollowService.getCouple(page);
    }
    @FieldResolver()
    public followingUser(@Root() root: InstagramUserFollow) {
        return this.instagramUserService.getOrFail({ username: root.followingUsername });
    }
    @FieldResolver()
    public followedUser(@Root() root: InstagramUserFollow) {
        return this.instagramUserService.getOrFail({ username: root.followedUsername });
    }
    @Mutation(() => Int)
    public async instagramUserFollowedBy(@Args() args: InstagramUserFollowedByInput): Promise<number> {
        if (args.create) {
            await this.instagramUserService.createCouple(hydrate.usernames(args.followedBy));
        }
        const follows = await this.instagramUserFollowService.addManyFollowers(args.followedBy, args.username);
        return follows.length;
    }
    @Mutation(() => Int)
    public async instagramUserFollowing(@Args() args: InstagramUserFollowingInput): Promise<number> {
        if (args.create) {
            await this.instagramUserService.createCouple(hydrate.usernames(args.following));
        }
        const follows = await this.instagramUserFollowService.addManyFollowees(args.username, args.following);
        return follows.length;
    }
    @Query(() => GetMostFollowedNotImportedUsers)
    public async mostFollowedNotImportedUsers(
        @Args() page: ListPageArgs,
    ): Promise<TInstagramUserFollowerCountList> {
        return await this.instagramUserFollowService.getMostFollowedNotImportedUsers(page);
    }
}
