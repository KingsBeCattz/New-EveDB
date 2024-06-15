import { D as DatabaseServer } from '../../shared/default.b89efed5.js';
import { a as JSONObject } from '../../shared/default.e6d281e4.js';
import { IncomingMessage, ServerResponse } from 'http';
import '../Router/index.js';
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
