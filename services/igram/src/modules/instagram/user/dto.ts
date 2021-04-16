import { Field, ObjectType } from 'type-graphql';
import { TInstagramFollower, TInstagramFollowers, TInstagramUser } from '../client/types';
import { InstagramPageInfo } from '../common/dto';

export type TPartialInstagramUser = Partial<TInstagramUser>;

@ObjectType()
export class InstagramUser implements TPartialInstagramUser {
    @Field()
    public biography!: string;
    @Field()
    public id!: string;
    @Field()
    public username!: string;
}

@ObjectType()
export class InstagramFollower implements TInstagramFollower {
    @Field()
    public id!: string;
    @Field()
    public username!: string;
    @Field()
    public full_name!: string;
    @Field()
    public profile_pic_url!: string;
    @Field()
    public is_verified!: boolean;
    @Field()
    public followed_by_viewer!: boolean;
    @Field()
    public requested_by_viewer!: boolean;
}

@ObjectType()
export class InstagramFollowers implements TInstagramFollowers {
    @Field()
    public count!: number;
    @Field()
    public page_info!: InstagramPageInfo;
    @Field(() => [InstagramFollower])
    public data!: InstagramFollower[];
}

@ObjectType()
export class InstagramFollowing extends InstagramFollower {}
@ObjectType()
export class InstagramFollowings extends InstagramFollowers {}
