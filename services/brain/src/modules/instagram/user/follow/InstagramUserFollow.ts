import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Repository } from 'typeorm';
import { ListPage } from '../../../common/dto';
import { TListPageResult } from '../../../common/type';
import { InstagramUser } from '../InstagramUser';

@Entity()
@ObjectType()
export class InstagramUserFollow {
    @Field(() => ID)
    @PrimaryColumn()
    public followerUsername!: string;

    @Field(() => ID)
    @PrimaryColumn()
    public followeeUsername!: string;

    @Field(() => InstagramUser)
    @ManyToOne(() => InstagramUser, (user) => user.followedBy, { primary: true, cascade: true })
    @JoinColumn({ name: 'followerUsername' })
    public follower!: InstagramUser;

    @Field(() => InstagramUser)
    @ManyToOne(() => InstagramUser, (user) => user.follows, { primary: true, cascade: true })
    @JoinColumn({ name: 'followeeUsername' })
    public followee!: InstagramUser;
}

@ObjectType()
export class InstagramUserFollowList implements TListPageResult<InstagramUserFollow> {
    @Field()
    public askedPage!: ListPage;
    @Field(() => [InstagramUserFollow])
    public items!: InstagramUserFollow[];
    @Field()
    public totalCount!: number;
}
export type InstagramUserFollowRepository = Repository<InstagramUserFollow>;
