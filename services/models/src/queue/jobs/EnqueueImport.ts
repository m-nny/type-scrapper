import { isEnumFactory } from '../../helpers';

// EnqueueImport
export const enqueueImportJobs = ['mostFollowed'] as const;
export type EnqueueImportJob = typeof enqueueImportJobs[number];
export const isEnqueueImportJob = isEnumFactory(enqueueImportJobs);

export type EnqueueImportData = {
    count?: number;
};
