export type TListPage = {
    skip: number;
    take: number;
};

export type TListPageResult<Item> = {
    items: Item[];
    totalCount: number;
    askedPage: TListPage;
};
