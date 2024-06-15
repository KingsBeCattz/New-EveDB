import { a as JSONObject, J as JSONValue } from './default.e6d281e4.js';

interface ClientEvents {
    request: {
        data: any;
    };
    anotherEvent: {
        data: string;
    };
}
type ClientOptions = {
    authorization: string;
};
type MethodFetch = {
    data: Response;
    json?: JSONObject;
};
type MethodGetAll = {
    tables: {
        [k: string]: JSONObject;
    };
    backups: {
        [id: string]: {
            [k: string]: JSONObject;
        };
    };
};
type MethodGetTables = {
    [k: string]: JSONObject;
};
type MethodGetBackups = {
    [id: string]: {
        [k: string]: JSONObject;
    };
};
interface MethodBackupGet {
    base: MethodGetTables;
    with_table: {
        table: string;
        data: MethodGetTables | null;
    };
    with_key: {
        table: string;
        key: string;
        data: JSONValue;
    };
}
interface MethodBackupRestore {
    base: {
        success: boolean;
        id: string | null;
    };
    with_table: {
        success: boolean;
        id: string | null;
        table: string | null;
    };
    with_key: {
        success: boolean;
        id: string | null;
        table: string | null;
        key: string | null;
    };
}
type MethodTableGet = {
    table: string;
    key: string;
    value: JSONValue | undefined;
};
type MethodTableSet = {
    table: string;
    key: string;
    old: JSONValue | undefined;
    value: JSONValue;
};
type MethodTableDelete = {
    table: string;
    key: string | null;
    value: boolean;
};
type MethodTableClear = {
    table: string;
    value: boolean;
};
interface ClientMethods {
    fetch: MethodFetch;
    all: MethodGetAll;
    tables: MethodGetTables;
    backups: MethodGetBackups;
    backup: {
        create: {
            success: boolean;
            id: string | null;
        };
        get: MethodBackupGet;
        restore: MethodBackupRestore;
    };
    table: {
        get: MethodTableGet;
        set: MethodTableSet;
        delete: MethodTableDelete;
        clear: MethodTableClear;
    };
}

export type { ClientEvents as C, MethodFetch as M, ClientOptions as a, MethodGetAll as b, MethodGetTables as c, MethodGetBackups as d, MethodBackupGet as e, MethodBackupRestore as f, MethodTableGet as g, MethodTableSet as h, MethodTableDelete as i, MethodTableClear as j, ClientMethods as k };
