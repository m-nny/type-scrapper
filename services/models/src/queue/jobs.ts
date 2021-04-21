import _ from 'lodash';
import { isEnumFactory } from '../helpers';
import { AsyncResult, OkResult } from '../result';

// ImportInstagramUser
export const importInstagramUserJobs = ['getUserProfile', 'getUserFollowers', 'getUserFollowings'] as const;
export type ImportInstagramUserJob = typeof importInstagramUserJobs[number];
export const isImportInstagramUserJob = isEnumFactory(importInstagramUserJobs);

export type ImportInstagramUserData = {
    username: string;
};


// EnqueueImport
export const enqueueImportJobs = ['mostFollowed'] as const;
export type EnqueueImportJob = typeof enqueueImportJobs[number];
export const isEnqueueImportJob = isEnumFactory(enqueueImportJobs);


export type JobHandlers<Jobs extends string, JobArg = unknown, JobResult = OkResult> = Record<
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
