import { singleton } from 'tsyringe';
import { Args, ID, Int, Mutation, Query, Resolver } from 'type-graphql';
import { EnqueueImportInput } from './dto';
import { EnqueueImportQueue } from './queue';

@singleton()
@Resolver()
export class EnqueueImportResolver {
    public constructor(private queue: EnqueueImportQueue) {}
    @Query(() => Int)
    public zero2() {
        return 0;
    }
    @Mutation(() => ID)
    public async enqueueImport(@Args() { jobName }: EnqueueImportInput): Promise<string> {
        const job = await this.queue.addJob(jobName);
        return job.id ?? '-1';
    }
}
