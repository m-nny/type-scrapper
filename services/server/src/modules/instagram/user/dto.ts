import { IsString, IsUrl } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';
import { InstagramUserCreateArg, InstagramUserKey } from './InstagramUser';

@ArgsType()
export class InstagramUserKeyDTO implements InstagramUserKey {
    @IsString()
    public username!: string;
}

@InputType()
export class CreateInstagramUserInput implements InstagramUserCreateArg {
    @Field()
    @IsString()
    public username!: string;

    @Field()
    @IsUrl()
    public avatarUrl!: string;
}
