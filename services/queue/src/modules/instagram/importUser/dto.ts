import { ImportInstagramUserData, ImportInstagramUserJob, importInstagramUserJobs } from '@app/models';
import { IsIn, IsString, ValidateNested } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class ImportInstagramUserDataInput implements ImportInstagramUserData {
    @IsString()
    @Field()
    public username!: string;
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
