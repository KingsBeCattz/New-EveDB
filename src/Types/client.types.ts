import { JSONObject, JSONValue } from "./json.types";

export interface ClientEvents {
	request: { data: any };
	anotherEvent: { data: string };
}

export type ClientOptions = {
	authorization: string;
};

export type MethodFetch = {
	data: Response;
	json?: JSONObject;
};

export type MethodGetAll = {
	tables: { [k: string]: JSONObject };
	backups: { [id: string]: { [k: string]: JSONObject } };
};

export type MethodGetTables = { [k: string]: JSONObject };

export type MethodGetBackups = { [id: string]: { [k: string]: JSONObject } };

export interface MethodBackupGet {
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

export interface MethodBackupRestore {
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

export type MethodTableGet = {
	table: string;
	key: string;
	value: JSONValue | undefined;
};

export type MethodTableSet = {
	table: string;
	key: string;
	old: JSONValue | undefined;
	value: JSONValue;
};

export type MethodTableDelete = {
	table: string;
	key: string | null;
	value: boolean;
};

export type MethodTableClear = {
	table: string;
	value: boolean;
};

export interface ClientMethods {
	fetch: MethodFetch;
	all: MethodGetAll;
	tables: MethodGetTables;
	backups: MethodGetBackups;
	backup: {
		create: { success: boolean; id: string | null };
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
