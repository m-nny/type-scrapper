import _ from 'lodash';
import { AsyncResult, OkResult } from '../../result';

export * from './EnqueueImport';
export * from './ImportInstagramUser';

export type JobHandlers<Jobs extends string, JobArg = unknown, JobResult = unknown> = Record<
    Jobs,
    (args: JobArg) => AsyncResult<JobResult>
>;

export class UnknownJobNameError extends Error {
    public name = 'JobHandlerDoesNotExists';
    public existingJobHandlerNames: string[];
    public constructor(public jobName: string, jobHandlers: JobHandlers<any, any>) {
        super(`Job handler with name ${jobName} does not exist`);
        this.existingJobHandlerNames = _.keys(jobHandlers);
    }
}
