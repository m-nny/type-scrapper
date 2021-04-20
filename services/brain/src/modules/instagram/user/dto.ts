import { IsArray, IsBoolean, IsNumberString, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';
import { ListPageArgs } from '../../common/dto';
import { InstagramUserCreateDTO, InstagramUserKey } from './InstagramUser';
import { InstagramUserInfoCreateDTO } from './InstagramUserInfo';
import { AddFollowedByArgs, AddFollowingArgs, GetCoupleInstagramUsersArgs } from './types';

@ArgsType()
@InputType()
export class InstagramUserKeyDTO implements InstagramUserKey {
    @Field()
    @IsString()
    public username!: string;
}

@InputType()
@ArgsType()
export class InstagramUserInfoInput implements InstagramUserInfoCreateDTO {
    @Field()
    @IsNumberString()
    public id!: string;
    @Field()
    @IsUrl()
    public avatarUrl!: string;
}

@InputType()
export class InstagramUserInput extends InstagramUserKeyDTO implements InstagramUserCreateDTO {
    @Field({ nullable: true })
    @IsOptional()
    @ValidateNested()
    public info?: InstagramUserInfoInput;
}

@InputType()
@ArgsType()
export class InstagramUsersArgs implements GetCoupleInstagramUsersArgs {
    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    public onlyNotImported?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @ValidateNested()
    public page?: ListPageArgs;
}

@ArgsType()
@InputType()
export class InstagramUserFollowedByInput extends InstagramUserKeyDTO implements AddFollowedByArgs {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    public followedBy!: string[];
}

@ArgsType()
@InputType()
export class InstagramUserFollowingInput extends InstagramUserKeyDTO implements AddFollowingArgs {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    public following!: string[];
}
