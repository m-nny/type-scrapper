import { CookieJar } from 'tough-cookie';

export type TInstagramCredentials = {
    username: string;
    password: string;
};

export type TInstagramConstructorArgs = TInstagramCredentials & {
    cookieStore?: CookieJar;
};

export type TInstagramLoginOptions = {
    _sharedData?: boolean;
};

export type TInstagramGetUserByUsername = {
    username: string;
};
