import { ImportInstagramUserData, ImportInstagramUserJob, importInstagramUserJobs } from '@app/models';
import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class ImportInstagramUserDataInput implements ImportInstagramUserData {
    @IsString()
    @Field()
    public username!: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    public cursor?: string;
}

@ArgsType()
export class ImportInstagramUserInput {
    @Field()
    @ValidateNested()
    public data!: ImportInstagramUserDataInput;
    @Field()
    @IsIn(importInstagramUserJobs)
    public jobName!: ImportInstagramUserJob;
}
