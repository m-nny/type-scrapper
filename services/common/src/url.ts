import _ from 'lodash';
export type MakeUrlArg = {
    protocol?: string;
    hostname: string;
    port?: number;
    endpoint?: string;
};
type UrlData = Required<MakeUrlArg>;
const defaultUrlData: UrlData = {
    protocol: 'http',
    hostname: 'localhost',
    port: 80,
    endpoint: '',
};

export const makeUrl = (source: MakeUrlArg): string => {
    const { protocol, hostname, port, endpoint }: UrlData = _.merge({}, defaultUrlData, source);
    return `${protocol}://${hostname}:${port}${endpoint}`;
};

export type MakeUrlMapArg = Record<string, MakeUrlArg>;
export type UrlMap<M extends MakeUrlMapArg> = Record<keyof M, string>;
export const makeUrlMap = <T extends MakeUrlMapArg>(map: T): UrlMap<T> => _.mapValues(map, (x) => makeUrl(x));
