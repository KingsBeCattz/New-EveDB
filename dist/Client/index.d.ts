import { EventEmitter } from './event.client.js';
export { EventsMap, Listener } from './event.client.js';
import { J as JSONValue } from '../shared/default.e6d281e4.js';
import { C as ClientEvents, a as ClientOptions, k as ClientMethods } from '../shared/default.32e9ba7b.js';

declare class DatabaseClient extends EventEmitter<ClientEvents> {
    url: string;
    authorization: string;
    constructor(url: string, options: ClientOptions);
    private fetch;
    ping(): Promise<number>;
    check(log?: boolean, exit?: boolean): Promise<boolean | undefined>;
    get(method: "all"): Promise<ClientMethods["all"]>;
    get(method: "tables"): Promise<ClientMethods["tables"]>;
    get(method: "backups"): Promise<ClientMethods["backups"]>;
    backup(method: "create"): Promise<ClientMethods["backup"]["create"]>;
    backup(method: "get", id: string): Promise<ClientMethods["backup"]["get"]["base"]>;
    backup(method: "get", id: string, table: string): Promise<ClientMethods["backup"]["get"]["with_table"]>;
    backup(method: "get", id: string, table: string, key: string): Promise<ClientMethods["backup"]["get"]["with_key"]>;
    backup(method: "restore", id: string): Promise<ClientMethods["backup"]["restore"]["base"]>;
    backup(method: "restore", id: string, table: string): Promise<ClientMethods["backup"]["restore"]["with_table"]>;
    backup(method: "restore", id: string, table: string, key: string): Promise<ClientMethods["backup"]["restore"]["with_key"]>;
    backup(method: "delete", id: string): Promise<ClientMethods["backup"]["restore"]["base"]>;
    backup(method: "delete", id: string, table: string): Promise<ClientMethods["backup"]["restore"]["with_table"]>;
    backup(method: "delete", id: string, table: string, key: string): Promise<ClientMethods["backup"]["restore"]["with_key"]>;
    table(method: "get", table: string, key: string): Promise<ClientMethods["table"]["get"]>;
    table(method: "set", table: string, key: string, value: JSONValue): Promise<ClientMethods["table"]["set"]>;
    table(method: "delete", table: string): Promise<ClientMethods["table"]["delete"]>;
    table(method: "delete", table: string, key: string): Promise<ClientMethods["table"]["delete"]>;
}

export { DatabaseClient, EventEmitter };
