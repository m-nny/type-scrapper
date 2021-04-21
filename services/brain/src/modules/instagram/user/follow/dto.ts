import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { ArgsType, Field, InputType, ObjectType } from 'type-graphql';
import { ListPage } from '../../../common/dto';
import { InstagramUserKey } from '../InstagramUser';
import {
    AddFollowedByArgs,
    AddFollowingArgs,
    CreateIfNeeded,
    TInstagramUserFollowerCountList,
    TInstagramUserFollowerCount,
} from './types';

@ArgsType()
@InputType()
export class CreateIfNeededInput implements CreateIfNeeded {
    @Field({ nullable: true, defaultValue: false })
    @IsOptional()
    @IsBoolean()
    create: boolean = false;
}

@ArgsType()
@InputType()
class CommonInput extends CreateIfNeededInput {
    @Field()
    @IsString()
    public username!: string;
}

@ArgsType()
@InputType()
export class InstagramUserFollowedByInput extends CommonInput implements AddFollowedByArgs {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    public followedBy!: string[];
}

@ArgsType()
@InputType()
export class InstagramUserFollowingInput extends CommonInput implements AddFollowingArgs {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    public following!: string[];
}

@ObjectType()
export class InstagramUserFollowerCount extends InstagramUserKey implements TInstagramUserFollowerCount {
    @Field()
    public followersCount!: number;
}

@ObjectType()
export class GetMostFollowedNotImportedUsers implements TInstagramUserFollowerCountList {
    @Field()
    public askedPage!: ListPage;
    @Field(() => [InstagramUserFollowerCount])
    public items!: TInstagramUserFollowerCount[];
    @Field()
    public totalCount!: number;
}
