import { singleton } from 'tsyringe';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { ListPageArgs } from '../../common/dto';
import { InstagramUserInput, InstagramUserKeyDTO, InstagramUsersArgs } from './dto';
import { InstagramUserNotFoundError } from './errors';
import { InstagramUser, InstagramUserList } from './InstagramUser';
import { InstagramUserService } from './InstagramUserService';

@singleton()
@Resolver(() => InstagramUser)
export class InstagramUserResolver {
    public constructor(private instagramUserService: InstagramUserService) {}
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
}
