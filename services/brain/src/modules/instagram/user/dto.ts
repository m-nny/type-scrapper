import { IsBoolean, IsNumberString, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';
import { ListPageArgs } from '../../common/dto';
import { InstagramUserCreateDTO, TInstagramUserKey } from './InstagramUser';
import { InstagramUserInfoCreateDTO } from './InstagramUserInfo';
import { GetCoupleInstagramUsersArgs } from './types';

@ArgsType()
@InputType()
export class InstagramUserKeyInput implements TInstagramUserKey {
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
export class InstagramUserInput extends InstagramUserKeyInput implements InstagramUserCreateDTO {
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
