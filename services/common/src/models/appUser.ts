import _ from 'lodash';
import { isValidRole, UserRole } from './userCredential';

export type AppUser = {
    username: string;
    fullname: string;
    role: UserRole;

    // jwt default fields
    // iat: number;
    // exp: number;
    // iss: string;
};

export const isAppUser = (obj: any): obj is AppUser =>
    !_.isNull(obj) && !_.isUndefined(obj) && _.isString(obj.username) && _.isString(obj.fullname) && isValidRole(obj.role);
