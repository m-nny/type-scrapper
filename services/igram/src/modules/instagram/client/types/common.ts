export type TInstagramEdgeCount = {
    count: number;
};
export type TInstagramPageInfo = {
    has_next_page: boolean;
    end_cursor: null | string;
};
export type TInstagramEdge<E> = {
    count?: number;
    page_info?: TInstagramPageInfo;
    edges?: null | Array<{ node: E }>;
};
export type TInstagramList<E> = {
    count: number;
    page_info: TInstagramPageInfo;
    data: E[];
};

export type TInstagramDimensions = {
    height: number;
    width: number;
};
export type TInstagramUsernameAndId = {
    id: string;
    username: string;
};
export type TInstagramUsername = {
    username: string;
};
export type TInstagramUserId = {
    userId: string;
};
