import _ from 'lodash';
import { S3FileUrl } from './url';
export type FaceRecResponse = {
    username: 'unknown' | string;
    user_id: 'unknown' | string;
}[];
export type MTPResponseError = {
    errorMessage: string;
};
export type MTPResponseSuccess = S3FileUrl;
export type Base64ImagePayload = { status: 'SUCCESS'; photo: string };

export type Base64ImageErrorPayload = {
    status: 'NOT FOUND';
};

export const isMTPResponseError = (obj: any): obj is MTPResponseError => _.isString(obj?.errorMessage);
