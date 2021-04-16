import { Field, ObjectType } from 'type-graphql';
import { TInstagramUser } from '../client/types';

export type TPartialInstagramUser = Partial<TInstagramUser>;

@ObjectType()
export class InstagramUser implements TPartialInstagramUser {
    @Field()
    public biography!: string;
    @Field()
    public id!: string;
}
