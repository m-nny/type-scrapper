export type MakeNonNullable<T> = Required<{ [K in keyof T]: NonNullable<T[K]> }>;
export type PickNullable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PickNonNullable<T, K extends keyof T> = Omit<T, K> & MakeNonNullable<Pick<T, K>>;
export type PickSet<T, K extends keyof T, V = null> = Omit<T, K> & Record<K, V>;
