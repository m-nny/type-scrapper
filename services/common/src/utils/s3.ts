import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { S3FileUrl } from '../models/url';
import { makeUrl, MakeUrlArg } from './url';

type MakeS3UrlArg = {
    objectId: string;
    bucketName: string;
    filename: string;
};
export const makeS3Url = (s3Config: MakeUrlArg, { objectId, filename, bucketName }: MakeS3UrlArg): S3FileUrl => {
    const relativeUrl = `/${bucketName}/${filename}`;
    const publicUrl = `${makeUrl(s3Config)}${relativeUrl}`;
    return {
        objectId,
        relativeUrl,
        publicUrl,
    };
};

const makePublicPolicy = (bucketName: string) => ({
    Version: '2012-10-17',
    Statement: [
        {
            Action: ['s3:GetObject'],
            Effect: 'Allow',
            Principal: {
                AWS: ['*'],
            },
            Resource: [`arn:aws:s3:::${bucketName}/*`],
            Sid: '',
        },
    ],
});

export const makePublicPolicyStringified = (bucketName: string): string => JSON.stringify(makePublicPolicy(bucketName));

export const makeUniqueFilename = (fileExtension: string, dirname?: string) => {
    const filename = `${uuid()}_${moment().unix()}.${fileExtension}`;
    if (!dirname) {
        return filename;
    }
    return `${dirname}/${filename}`;
};

export const makeUniqueFilenameDateFolder = (fileExtension: string) => {
    const now = moment();
    const filename = `${uuid()}_${now.unix()}${fileExtension}`;
    const dirname = now.format('YYYY-MM-DD');
    return `${dirname}/${filename}`;
};
