export type JsonScalar = string | number | boolean | null;
export type JsonArray = Array<JustJson>;
export type JsonObject = { [key: string]: JustJson };
export type JustJson = JsonScalar | JsonArray | JsonObject;

export type PseudoJsonArray = Array<JsonScalar | JsonObject>;
export type PseudoJsonObject = { [key: string]: JsonScalar };
export type PseudoJustJson = JsonScalar | PseudoJsonArray | PseudoJsonObject;
