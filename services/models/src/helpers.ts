export const isEnumFactory = <T extends string>(enums: readonly T[]) => (obj: any): obj is T =>
    enums.indexOf(obj) !== -1;
