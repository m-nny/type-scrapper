import { EnqueueImportJob, enqueueImportJobs } from '@app/models';
import { IsIn } from 'class-validator';
import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class EnqueueImportInput {
    @Field()
    @IsIn(enqueueImportJobs)
    public jobName!: EnqueueImportJob;
}
