import { EnqueueImportData, EnqueueImportJob, enqueueImportJobs } from '@app/models';
import { IsIn, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
export class EnqueueImportDataInput implements EnqueueImportData {
    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    public count?: number;
}

@ArgsType()
export class EnqueueImportInput {
    @Field()
    @ValidateNested()
    public data!: EnqueueImportDataInput;
    @Field()
    @IsIn(enqueueImportJobs)
    public jobName!: EnqueueImportJob;
}
