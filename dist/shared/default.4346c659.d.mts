import { Router } from '../Auxiliar/Router/index.mjs';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { a as JSONObject } from './default.e6d281e4.mjs';

declare class Util {
    server: DatabaseServer;
    constructor(server: DatabaseServer);
    checkFolders(): void;
    insert(table: string, data: string): void;
    createBackup(log?: boolean): string;
    restoreBackup(id: string, table?: string, key?: string): true | void;
    deleteBackup(id: string, table?: string, key?: string): true | void;
    getTables(): {
        [k: string]: JSONObject;
    };
    getBackups(): {
        [k: string]: {
            [k: string]: JSONObject;
        };
    };
}

type BackupOptions = {
    interval: number;
    report: boolean;
};
type ServerOptions = {
    port: number;
    path: string;
    tables: string[];
    auth: string;
    backup?: BackupOptions;
};
declare class DatabaseServer {
    app: Server<typeof IncomingMessage, typeof ServerResponse> | null;
    util: Util;
    router: Router;
    authorization: string;
    port: number;
    path: string;
    tables: string[];
    backup?: BackupOptions;
    constructor(options: ServerOptions);
    start(): Promise<void>;
}

export { type BackupOptions as B, DatabaseServer as D, type ServerOptions as S, Util as U };
