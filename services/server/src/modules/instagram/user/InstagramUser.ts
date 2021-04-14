import { Field, ObjectType } from 'type-graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, Repository } from 'typeorm';
import { ListPage } from '../../common/dto';
import { TListPageResult } from '../../common/type';
import { InstagramImage } from '../image/InstagramImage';

@ObjectType()
@Entity()
export class InstagramUser {
    @Field()
    @PrimaryColumn()
    public username!: string;

    @Field()
    @Column()
    public avatarUrl!: string;

    @Field()
    @CreateDateColumn({ type: 'timestamptz' })
    public importDate!: Date;

    @Field(() => [InstagramImage])
    @OneToMany(() => InstagramImage, (image) => image.author)
    public images?: InstagramImage;
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

export type InstagramUserKey = Pick<InstagramUser, 'username'>;
export type InstagramUserCreateArg = Omit<InstagramUser, 'images' | 'importDate'>;
