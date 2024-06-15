export { RouteBody, Router } from './Auxiliar/Router/index.js';
export { B as BackupOptions, D as DatabaseServer, S as ServerOptions, U as Util } from './shared/default.b89efed5.js';
export { Context } from './Auxiliar/Context/index.js';
export { AnsiStyle, Logger, logger } from './Auxiliar/logger.js';
export { Methods, get } from './Types/index.js';
export { DatabaseClient } from './Client/index.js';
export { Server as HTTPServer, IncomingMessage as Request, ServerResponse as Response } from 'http';
export { b as JSONArray, a as JSONObject, J as JSONValue } from './shared/default.e6d281e4.js';
export { C as ClientEvents, k as ClientMethods, a as ClientOptions, e as MethodBackupGet, f as MethodBackupRestore, M as MethodFetch, b as MethodGetAll, d as MethodGetBackups, c as MethodGetTables, j as MethodTableClear, i as MethodTableDelete, g as MethodTableGet, h as MethodTableSet } from './shared/default.32e9ba7b.js';
export { EventEmitter, EventsMap, Listener } from './Client/event.client.js';
import '@/index';
import '@/Types';

declare function genAuthCode(): string;

export { genAuthCode };
