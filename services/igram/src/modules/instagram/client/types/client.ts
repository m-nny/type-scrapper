import { CookieJar, Store } from 'tough-cookie';

export type TInstagramCredentials = {
    username: string;
    password: string;
};
export type TInstagramPagination = {
    first?: number;
    after?: string;
}

export type TInstagramConstructorArgs = TInstagramCredentials & {
    cookieStore?: Store;
};

export type TInstagramLoginOptions = {
    _sharedData?: boolean;
};

