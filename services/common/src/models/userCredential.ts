import _ from 'lodash';
export enum UserRole {
    ADMIN = 'admin',
    STUDENT = 'student',
    PROCTOR = 'proctor',
    GUEST = 'guest',
    ROBOT = 'robot',
}
export const userRoles = [UserRole.ADMIN, UserRole.STUDENT, UserRole.PROCTOR, UserRole.GUEST, UserRole.ROBOT];

export type UserCredential = {
    fullname: string;
    username: string;
    password_hashed: string;
    role: UserRole;
};
export type UserCredentialKey = Pick<UserCredential, 'username'>;

export type CreateUserCredentialDTO = Pick<UserCredential, 'fullname' | 'username'> & {
    password: string;
};

export type UserLoginDTO = {
    username: string;
    password: string;
};

export type UserCredentialUpdateDTO = {
    role?: UserRole;
    password?: string;
    fullname?: string;
};

export const isAdmin = (currentUserRole: UserRole): boolean => currentUserRole === UserRole.ADMIN;
export const isValidRole = (obj: any): obj is UserRole =>
    !_.isNull(obj) && !_.isUndefined(obj) && Object.values(UserRole).includes(obj);
