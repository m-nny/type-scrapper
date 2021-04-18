import { singleton } from 'tsyringe';
import { Args, ID, Int, Mutation, Query, Resolver } from 'type-graphql';
import { ImportInstagramUserInput } from './dto';
import { ImportInstagramUserQueue } from './queue';

@singleton()
@Resolver()
export class ImportInstagramUserResolver {
    public constructor(private queue: ImportInstagramUserQueue) {}
    @Query(() => Int)
    public zero() {
        return 0;
    }
    @Mutation(() => ID)
    public async importUser(@Args() { data, jobName }: ImportInstagramUserInput): Promise<string> {
        const job = await this.queue.addJob(jobName, data);
        return job.id ?? '-1';
    }
}
