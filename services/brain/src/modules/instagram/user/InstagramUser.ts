import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    Repository,
} from 'typeorm';
import { ListPage } from '../../common/dto';
import { TListPageResult } from '../../common/type';
import { InstagramImage } from '../image/InstagramImage';
import { InstagramUserFollow } from './follow/InstagramUserFollow';
import { InstagramUserInfo, InstagramUserInfoCreateDTO } from './InstagramUserInfo';

@ObjectType()
@Entity()
export class InstagramUser extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    public username!: string;

    @Field(() => ID, { nullable: true })
    @Column({ unique: true, nullable: true })
    public id?: string;

    @Field(() => InstagramUserInfo, { nullable: true })
    @OneToOne(() => InstagramUserInfo, (info) => info.id, { cascade: true, eager: true })
    @JoinColumn({ name: 'id' })
    public info?: InstagramUserInfo;

    @Field(() => [InstagramImage])
    @OneToMany(() => InstagramImage, (image) => image.author)
    public images?: InstagramImage;

    @Field(() => [InstagramUserFollow])
    @OneToMany(() => InstagramUserFollow, (follow) => follow.followee)
    @JoinTable()
    public follows?: InstagramUserFollow[];

    @Field(() => [InstagramUserFollow])
    @OneToMany(() => InstagramUserFollow, (follow) => follow.follower)
    @JoinTable()
    public followedBy?: InstagramUserFollow[];
}

@ObjectType()
export class InstagramUserList implements TListPageResult<InstagramUser> {
    @Field()
    public askedPage!: ListPage;
    @Field(() => [InstagramUser])
    public items!: InstagramUser[];
    @Field()
    public totalCount!: number;
}

export type InstagramUserRepository = Repository<InstagramUser>;

export type TInstagramUserKey = Pick<InstagramUser, 'username'>;

@ObjectType()
export class InstagramUserKey implements TInstagramUserKey {
    @Field()
    public username!: string;
}
export type InstagramUserCreateDTO = Pick<InstagramUser, 'id' | 'username'> & {
    info?: InstagramUserInfoCreateDTO;
};