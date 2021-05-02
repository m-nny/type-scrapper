import { Job } from 'bullmq';
import _ from 'lodash';

export const filterJob = (job: Job) => _.pick(job, ['id', 'name', 'data']);

export const filterUserFollowers = (followers: string[]) => ({
    followers: filterArray(followers),
});

export const filterArray = <T>(array: T[]) =>
    array.length < 5 ? array : { length: array.length, head: array.slice(0, 1)[0], tail: array.slice(-1)[0] };

export const filterError = (error: any) => error;