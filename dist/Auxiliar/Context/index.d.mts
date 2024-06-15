import { D as DatabaseServer } from '../../shared/default.4346c659.mjs';
import { a as JSONObject } from '../../shared/default.e6d281e4.mjs';
import { IncomingMessage, ServerResponse } from 'http';
import '../Router/index.mjs';
import '@/index';

declare class Context {
    server: DatabaseServer;
    req: IncomingMessage;
    res: ServerResponse;
    querys: {
        [k: string]: string;
    };
    body: JSONObject | null;
    constructor(server: DatabaseServer, req: IncomingMessage, res: ServerResponse);
    parseBody(): Promise<void>;
    send(code: number, data: string): void;
    send(code: number, data: JSONObject): void;
}

export { Context };
