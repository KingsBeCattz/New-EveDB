import { DatabaseServer, JSONObject } from "../../index";
import { join } from "path";
import { logger, AnsiStyle } from "../logger";
import {
	existsSync,
	mkdirSync,
	writeFileSync,
	readdirSync,
	readFileSync,
	rmSync,
	rm,
	rmdirSync,
} from "fs";
import { get, set, unset } from "lodash";

export class Util {
	server: DatabaseServer;
	constructor(server: DatabaseServer) {
		this.server = server;
	}

	/**
	 * Check if the necessary folders exist, if not, create them.
	 */
	public checkFolders() {
		let root = join(process.cwd(), this.server.path);
		if (!existsSync(root)) mkdirSync(root);
		if (!existsSync(join(root, "tables"))) mkdirSync(join(root, "tables"));
		if (!existsSync(join(root, "backups")) && this.server.backup)
			mkdirSync(join(root, "backups"));
	}

	/**
	 * Inserts
	 */
	insert(table: string, data: string) {
		this.checkFolders();
		const path = join(process.cwd(), this.server.path, "tables", `${table}.json`);
		writeFileSync(path, data, "utf8");
	}

	/**
	 * Creates a backup and returns it's id
	 */
	createBackup(log: boolean = Boolean(this.server.backup)): string {
		const root = join(process.cwd(), this.server.path, "backups");
		this.checkFolders();
		const id = String(Date.now());
		mkdirSync(join(root, id));
		const tables = this.getTables();
		for (const table of Object.keys(tables)) {
			const data = tables[table];
			writeFileSync(
				join(root, id, `${table}.json`),
				JSON.stringify(data, null, 2),
				"utf8"
			);
		}
		if (log) {
			logger.info(
				"BACKUPS",
				logger.color("Backup successfully performed", AnsiStyle.Bold) +
					logger.color(`\n\t> ID: `, AnsiStyle.Bold) +
					id +
					AnsiStyle.Reset +
					logger.color(`\n\t> Tables: `, AnsiStyle.Bold) +
					AnsiStyle.Reset +
					Object.keys(tables).join(" | ") +
					AnsiStyle.Reset
			);
		}

		return id;
	}

	restoreBackup(id: string, table?: string, key?: string) {
		const data = this.getBackups()[id];
		if (!data) return logger.error("BACKUP RESTORE FUNCTION", "Invalid ID");

		if (table && !data[table])
			return logger.error("BACKUP RESTORE FUNCTION", "Invalid TABLE");

		if (table && key && !get(data[table], key))
			return logger.error("BACKUP RESTORE FUNCTION", "Invalid KEY");

		const tables = Object.keys(data);

		if (table) {
			if (!tables.includes(table))
				return logger.error("BACKUP RESTORE FUNCTION", "Invalid TABLE");
			if (key) {
				const keyData = get(data[table], key);
				if (!keyData) return logger.error("BACKUP RESTORE FUNCTION", "Invalid KEY");
				set(data[table], key, keyData);
				this.insert(table, JSON.stringify(data[table], null, 2));
				return true;
			} else {
				this.insert(table, JSON.stringify(data[table], null, 2));
				return true;
			}
		} else {
			for (const _table of tables) {
				this.insert(_table, JSON.stringify(data[_table], null, 2));
			}
			return true;
		}
	}

	deleteBackup(id: string, table?: string, key?: string) {
		const data = this.getBackups()[id];
		if (!data) return logger.error("BACKUP DELETE FUNCTION", "Invalid ID");

		if (table && !data[table])
			return logger.error("BACKUP DELETE FUNCTION", "Invalid TABLE");

		if (table && key && !get(data[table], key))
			return logger.error("BACKUP DELETE FUNCTION", "Invalid KEY");

		const tables = Object.keys(data);
		const root = join(process.cwd(), this.server.path, "backups", id);

		if (table) {
			if (!tables.includes(table))
				return logger.error("BACKUP DELETE FUNCTION", "Invalid TABLE");
			console.log(data[table]);
			if (key) {
				unset(data[table], key);
				console.log(join(root, `${table}.json`));
				writeFileSync(
					join(root, `${table}.json`),
					JSON.stringify(data[table], null, 2),
					"utf8"
				);
				return true;
			} else {
				rmSync(join(root, `${table}.json`));
				return true;
			}
		} else {
			console.log(tables);
			for (const table of tables) {
				rmSync(join(root, `${table}.json`), { force: true });
			}
			rmdirSync(root);
			return true;
		}
	}
	/**
	 * Gets Tables
	 */
	getTables(): { [k: string]: JSONObject } {
		this.checkFolders();
		const root = join(process.cwd(), this.server.path, "tables");
		const tables = readdirSync(root);
		const entries: [string, JSONObject][] = [];
		for (const table of tables) {
			entries.push([
				table.slice(0, table.length - 5),
				JSON.parse(readFileSync(join(root, table)).toString()),
			]);
		}
		return Object.fromEntries(entries);
	}

	/**
	 * Gets Backups
	 */
	getBackups() {
		this.checkFolders();
		const root = join(process.cwd(), this.server.path, "backups");
		const backups = readdirSync(root);
		const entries: [string, { [k: string]: JSONObject }][] = [];
		for (var backup of backups) {
			const tables = readdirSync(
				join(process.cwd(), this.server.path, "backups", backup)
			);
			const tablesEntries: [string, JSONObject][] = [];
			for (const table of tables) {
				tablesEntries.push([
					table.slice(0, table.length - 5),
					JSON.parse(readFileSync(join(root, backup, table)).toString()),
				]);
			}

			entries.push([backup, Object.fromEntries(tablesEntries)]);
		}
		return Object.fromEntries(entries);
	}
}
