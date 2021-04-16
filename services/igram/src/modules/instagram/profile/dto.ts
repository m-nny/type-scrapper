import { Field, ObjectType } from 'type-graphql';
import { TInstagramProfile } from '../client/types';

@ObjectType()
export class InstagramProfile implements TInstagramProfile {
    @Field()
    public first_name!: string;
    @Field()
    public last_name!: string;
    @Field()
    public email!: string;
    @Field()
    public is_email_confirmed!: boolean;
    @Field()
    public is_phone_confirmed!: boolean;
    @Field()
    public username!: string;
    @Field()
    public phone_number!: string;
    @Field()
    public gender!: number;
    @Field()
    public birthday!: string;
    // @Field()
    // public fb_birthday!: null;
    @Field()
    public biography!: string;
    @Field()
    public external_url!: string;
    @Field()
    public chaining_enabled!: boolean;
    @Field()
    public presence_disabled!: boolean;
    @Field()
    public business_account!: boolean;
    @Field()
    public usertag_review_enabled!: boolean;
    @Field()
    public custom_gender!: string;
    // @Field()
    // public profile_edit_params!: Record<string, TInstagramProfileEditParams>;
}
