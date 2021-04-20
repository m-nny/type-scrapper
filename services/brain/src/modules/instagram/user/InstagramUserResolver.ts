import { singleton } from 'tsyringe';
import { Arg, Args, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import {
    InstagramUserInput,
    InstagramUserKeyDTO,
    InstagramUsersArgs
} from './dto';
import { InstagramUserNotFoundError } from './errors';
import { InstagramUserFollowService } from './follow/InstagramUserFollowService';
import { InstagramUser, InstagramUserList } from './InstagramUser';
import { InstagramUserService } from './InstagramUserService';

@singleton()
@Resolver(() => InstagramUser)
export class InstagramUserResolver implements ResolverInterface<InstagramUser> {
    public constructor(
        private instagramUserService: InstagramUserService,
        private instagramUserFollowService: InstagramUserFollowService,
    ) {}
    @Query(() => InstagramUser)
    public async instagramUser(@Args() key: InstagramUserKeyDTO): Promise<InstagramUser> {
        const item = await this.instagramUserService.get(key);
        if (item === undefined) {
            throw new InstagramUserNotFoundError(key);
        }
        return item;
    }
    @Query(() => InstagramUserList)
    public async instagramUsers(@Args() args: InstagramUsersArgs): Promise<InstagramUserList> {
        return this.instagramUserService.getCouple(args);
    }
    @Mutation(() => InstagramUser)
    public async createInstagramUser(@Arg('data') item: InstagramUserInput): Promise<InstagramUser> {
        return this.instagramUserService.create(item);
    }
    @FieldResolver()
    public async follows(@Root() root: InstagramUser) {
        return this.instagramUserFollowService.getUserFollows(root.username);
    }
    @FieldResolver()
    public async followedBy(@Root() root: InstagramUser) {
        return this.instagramUserFollowService.getUserFollowedBy(root.username);
    }
}
