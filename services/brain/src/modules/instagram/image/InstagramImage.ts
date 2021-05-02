import { Field, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { InstagramUser } from '../user/InstagramUser';

@ObjectType()
@Entity()
export class InstagramImage extends BaseEntity {
    @Field()
    @PrimaryColumn()
    public id!: string;

    @Field()
    @Column()
    public url!: string;

    @Field()
    @ManyToOne(() => InstagramUser, (user) => user.images)
    public author?: InstagramUser;
}
