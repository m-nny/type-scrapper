import { KnownArgumentNamesOnDirectivesRule } from 'graphql/validation/rules/KnownArgumentNamesRule';

export type TListPage = {
    skip: number;
    take: number;
};

export const defaultListPage : TListPage = {
    skip: 0,
    take: 20,
}

export type TListPageResult<Item> = {
    items: Item[];
    totalCount: number;
    askedPage: TListPage;
};
