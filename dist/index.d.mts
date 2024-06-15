export { RouteBody, Router } from './Auxiliar/Router/index.mjs';
export { B as BackupOptions, D as DatabaseServer, S as ServerOptions, U as Util } from './shared/default.4346c659.mjs';
export { Context } from './Auxiliar/Context/index.mjs';
export { AnsiStyle, Logger, logger } from './Auxiliar/logger.mjs';
export { Methods, get } from './Types/index.mjs';
export { DatabaseClient } from './Client/index.mjs';
export { Server as HTTPServer, IncomingMessage as Request, ServerResponse as Response } from 'http';
export { b as JSONArray, a as JSONObject, J as JSONValue } from './shared/default.e6d281e4.mjs';
export { C as ClientEvents, k as ClientMethods, a as ClientOptions, e as MethodBackupGet, f as MethodBackupRestore, M as MethodFetch, b as MethodGetAll, d as MethodGetBackups, c as MethodGetTables, j as MethodTableClear, i as MethodTableDelete, g as MethodTableGet, h as MethodTableSet } from './shared/default.189cf1b1.mjs';
export { EventEmitter, EventsMap, Listener } from './Client/event.client.mjs';
import '@/index';
import '@/Types';

declare function genAuthCode(): string;

export { genAuthCode };
