import { IsBoolean, IsOptional, IsString, Max, Min } from 'class-validator';
import { ArgsType, Field, InputType, Int, ObjectType } from 'type-graphql';
import { TInstagramPageInfo, TInstagramPagination } from '../client/types';

@ObjectType()
export class InstagramPageInfo implements TInstagramPageInfo {
    @Field()
    public has_next_page!: boolean;
    @Field(() => String, { nullable: true })
    public end_cursor!: string | null;
}

@InputType()
export class InstagramPageInput implements TInstagramPageInfo {
    @Field()
    @IsBoolean()
    public has_next_page!: boolean;
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    public end_cursor!: string | null;
}

@ArgsType()
@InputType()
export class InstagramPaginationArgs implements TInstagramPagination {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    @Max(50)
    first?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    after?: string;
}
