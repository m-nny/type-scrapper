import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class InstagramUserInfo extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn()
    public id!: string;

    @Field()
    @Column()
    public avatarUrl!: string;

    @Field()
    @CreateDateColumn({ type: 'timestamptz' })
    public importDate!: Date;
}

export type InstagramUserInfoKey = Pick<InstagramUserInfo, 'id'>;
export type InstagramUserInfoCreateDTO = Pick<InstagramUserInfo, 'id' | 'avatarUrl'>;
