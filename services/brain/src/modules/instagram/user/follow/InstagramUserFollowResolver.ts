import { singleton } from 'tsyringe';
import { Args, FieldResolver, Query, Resolver, ResolverInterface, Root } from 'type-graphql';
import { ListPageArgs } from '../../../common/dto';
import { InstagramUserService } from '../InstagramUserService';
import { InstagramUserFollow, InstagramUserFollowList } from './InstagramUserFollow';
import { InstagramUserFollowService } from './InstagramUserFollowService';

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
    public follower(@Root() root: InstagramUserFollow) {
        return this.instagramUserService.getOrFail({ username: root.followerUsername });
    }
    @FieldResolver()
    public followee(@Root() root: InstagramUserFollow) {
        return this.instagramUserService.getOrFail({ username: root.followeeUsername });
    }
}
