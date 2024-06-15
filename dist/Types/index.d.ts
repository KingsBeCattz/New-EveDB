import { J as JSONValue } from '../shared/default.e6d281e4.js';
export { b as JSONArray, a as JSONObject } from '../shared/default.e6d281e4.js';
export { C as ClientEvents, k as ClientMethods, a as ClientOptions, e as MethodBackupGet, f as MethodBackupRestore, M as MethodFetch, b as MethodGetAll, d as MethodGetBackups, c as MethodGetTables, j as MethodTableClear, i as MethodTableDelete, g as MethodTableGet, h as MethodTableSet } from '../shared/default.32e9ba7b.js';

type get = {
    table: string;
    key: string;
    value: JSONValue;
};

type Methods = "GET" | "POST" | "PUT" | "DELETE" | "ANY";

export { JSONValue, type Methods, type get };
