import { EventEmitter } from "./event.client.ts";
import {
	ClientEvents,
	ClientOptions,
	ClientMethods,
	Methods,
	JSONObject,
	JSONValue,
} from "../Types";
import { AnsiStyle, logger } from "@/Auxiliar/logger.ts";

export class DatabaseClient extends EventEmitter<ClientEvents> {
	/**
	 * URL of the database, for example: http://localhost:3000/
	 */
	url: string;
	/**
	 * Authorization code to validate the fetches, this must be identical to the one used in the DatabaseServer.
	 */
	authorization: string;
	constructor(url: string, options: ClientOptions) {
		super();
		this.url = new URL(url).toString();
		this.authorization = options.authorization;
	}

	private async fetch(
		url: string,
		method: Methods,
		body?: JSONObject
	): Promise<ClientMethods["fetch"]> {
		const init = {
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": this.authorization,
			},
			method,
		};
		if (body) Object.assign(init, { body: JSON.stringify(body) });
		const data = await fetch(url, init);
		try {
			const json = await data.json();
			return { data, json };
		} catch (e) {
			logger.error("Fetch", String(e));
			return {
				data,
			};
		}
	}

	/**
	 * Gets the latency with the server
	 */
	async ping(): Promise<number> {
		const start = Date.now();
		await this.fetch(this.url, "GET");
		return Date.now() - start;
	}

	/**
	 * Checks the conection
	 */
	async check(
		log: boolean = true,
		exit: boolean = true
	): Promise<boolean | undefined> {
		try {
			const start = Date.now();
			const { ok } = (await this.fetch(this.url, "GET")).data;
			if (log) {
				const date = new Date();
				console.log(
					logger.color(" EVE_DB ", AnsiStyle.BgBlue, AnsiStyle.Bold),
					logger.color(" CLIENT ", AnsiStyle.BgBrightCyan, AnsiStyle.Bold),
					logger.color(" CONNECTION ", AnsiStyle.BgBrightGreen, AnsiStyle.Bold),
					logger.color(
						`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
						AnsiStyle.Dim
					),
					logger.color(
						logger.format(
							`Connection to the server ${ok ? "is" : "isn't"} available (${this.url})`
						),
						AnsiStyle.Bold,
						AnsiStyle.Dim
					),
					logger.color(
						`\t${logger.color("Latency:", AnsiStyle.Bold)}${
							AnsiStyle.Reset
						} ${logger.color(`${Date.now() - start}ms`, AnsiStyle.Underline)}`,
						AnsiStyle.Dim
					)
				);
			}
			return ok;
		} catch (e) {
			console.log(logger.error("UNEXPECTED", String(e)));
			if (exit) process.exit(0);
		}
	}

	/**
	 * Recover all server data, as well as your tables and all your backups with your data.
	 */
	public async get(method: "all"): Promise<ClientMethods["all"]>;

	/**
	 * Retrieves all information from tables on the server
	 */
	public async get(method: "tables"): Promise<ClientMethods["tables"]>;

	/**
	 * Recover all data from backups on the server
	 */
	public async get(method: "backups"): Promise<ClientMethods["backups"]>;

	public async get(
		method: "all" | "tables" | "backups"
	): Promise<ClientMethods["all" | "tables" | "backups"]> {
		switch (method || "all") {
			case "all": {
				const data = await this.fetch(this.url, "GET");
				return data.json as ClientMethods["all"];
			}
			case "tables": {
				const data = await this.fetch(this.url + "tables/", "GET");
				return data.json as ClientMethods["tables"];
			}
			case "backups": {
				const data = await this.fetch(this.url + "backups/", "GET");
				return data.json as ClientMethods["backups"];
			}
		}
	}

	/**
	 * You create a new backup
	 */
	async backup(method: "create"): Promise<ClientMethods["backup"]["create"]>;

	/**
	 * You get all the information about a backup
	 */
	async backup(
		method: "get",
		id: string
	): Promise<ClientMethods["backup"]["get"]["base"]>;

	/**
	 * Get all the information about a table in a backup
	 */
	async backup(
		method: "get",
		id: string,
		table: string
	): Promise<ClientMethods["backup"]["get"]["with_table"]>;

	/**
	 * Get all the information about a key in a table from a backup
	 */
	async backup(
		method: "get",
		id: string,
		table: string,
		key: string
	): Promise<ClientMethods["backup"]["get"]["with_key"]>;

	/**
	 * Restore the entire database with backup copy
	 */
	async backup(
		method: "restore",
		id: string
	): Promise<ClientMethods["backup"]["restore"]["base"]>;

	/**
	 * You will restore a table in the database with a backup copy.
	 */
	async backup(
		method: "restore",
		id: string,
		table: string
	): Promise<ClientMethods["backup"]["restore"]["with_table"]>;

	/**
	 * You will restore a specific key of a table in the database with a backup copy.
	 */
	async backup(
		method: "restore",
		id: string,
		table: string,
		key: string
	): Promise<ClientMethods["backup"]["restore"]["with_key"]>;

	/**
	 * Restore the entire database with backup copy
	 */
	async backup(
		method: "delete",
		id: string
	): Promise<ClientMethods["backup"]["restore"]["base"]>;

	/**
	 * You will restore a table in the database with a backup copy.
	 */
	async backup(
		method: "delete",
		id: string,
		table: string
	): Promise<ClientMethods["backup"]["restore"]["with_table"]>;

	/**
	 * You will restore a specific key of a table in the database with a backup copy.
	 */
	async backup(
		method: "delete",
		id: string,
		table: string,
		key: string
	): Promise<ClientMethods["backup"]["restore"]["with_key"]>;

	async backup(
		method: "get" | "create" | "restore" | "delete",
		id?: string,
		table?: string,
		key?: string
	) {
		switch (method) {
			case "get": {
				if (!id)
					return logger.error(
						"Function Backup.Get",
						"You must provide the id of the backup to be obtained"
					);
				if (!(await this.get("backups"))[id]) return {};
				const querys: string[] = [];
				if (id) querys.push(`id=${id}`);
				if (table) querys.push(`table=${table}`);
				if (key) querys.push(`key=${key}`);
				const url = this.url + "backups/get" + `?${querys.join("&")}`;

				const data = await this.fetch(url, "GET");
				return data.json;
			}
			case "create": {
				const data = await this.fetch(this.url + "backups/create", "POST");
				return {
					success: true,
					id: data.json!.id,
				};
			}
			case "restore": {
				const data = await this.fetch(this.url + "backups/restore", "POST", {
					id: id!,
					table: table!,
					key: key!,
				});
				return data.json;
			}
			case "delete": {
				const data = await this.fetch(this.url + "backups/delete", "POST", {
					id: id!,
					table: table!,
					key: key!,
				});
				return data.json;
			}
		}
	}

	/**
	 * Get the data of some key in a table
	 * @param table Table to use
	 * @param key Key to obtain
	 */
	async table(
		method: "get",
		table: string,
		key: string
	): Promise<ClientMethods["table"]["get"]>;

	/**
	 * Sets a value to a table key
	 * @param table Table to use
	 * @param key Key to set
	 * @param value Value to set
	 */
	async table(
		method: "set",
		table: string,
		key: string,
		value: JSONValue
	): Promise<ClientMethods["table"]["set"]>;

	/**
	 * Clears an entire table
	 * @param table Table to clear
	 */
	async table(
		method: "delete",
		table: string
	): Promise<ClientMethods["table"]["delete"]>;

	/**
	 * Deletes a key from a table
	 * @param table Table to use
	 * @param key Key to delete
	 */
	async table(
		method: "delete",
		table: string,
		key: string
	): Promise<ClientMethods["table"]["delete"]>;

	async table(
		method: "get" | "set" | "delete",
		table?: string,
		key?: string,
		value?: JSONValue
	): Promise<any> {
		switch (method) {
			case "get": {
				const errorValue = {
					table,
					key,
					value: undefined,
				};
				try {
					const querys: string[] = [];
					if (table) querys.push(`table=${table}`);
					if (key) querys.push(`key=${key}`);
					const url = this.url + "tables/get" + `?${querys.join("&")}`;

					const data = await this.fetch(url, "GET");
					if (!data.data.ok) return errorValue;
					return {
						table: data.json!.table,
						key: data.json!.key,
						value: data.json!.value,
					};
				} catch (e) {
					logger.error('TABLE FUNCTION "GET"', String(e));
					return errorValue;
				}
			}
			case "set": {
				const errorValue = (ok: boolean) => {
					return {
						table: ok ? table : undefined,

						key: ok ? key : undefined,
						old: undefined,
						value: undefined,
					};
				};
				try {
					const data = await this.fetch(this.url + "tables/set", "POST", {
						table: table!,
						key: key!,
						value: value!,
					});
					if (!data.data.ok) return errorValue(data.data.ok);
					return {
						table: data.json!.table,
						key: data.json!.key,
						old: data.json!.values!["old"] ?? undefined,
						value: data.json!.values!["new"],
					};
				} catch (e) {
					logger.error('TABLE FUNCTION "SET"', String(e));
					return errorValue(true);
				}
			}
			case "delete": {
				const errorValue = {
					table,
					key,
					value: false,
				};
				try {
					const querys: string[] = [];
					if (table) querys.push(`table=${table}`);
					if (key) querys.push(`key=${key}`);
					const url = this.url + "tables/delete" + `?${querys.join("&")}`;

					const data = await this.fetch(url, "DELETE");
					if (!data.data.ok) return errorValue;
					return data.json;
				} catch (e) {
					logger.error('TABLE FUNCTION "DELETE"', String(e));
					return errorValue;
				}
			}
		}
	}
}

export * from "./event.client.ts";
