import { join } from 'path';
import { logger, AnsiStyle } from '../logger.mjs';
import { existsSync, mkdirSync, writeFileSync, rmSync, rmdirSync, readdirSync, readFileSync } from 'fs';
import { l as lodashExports } from '../../shared/default.e2d3b28e.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Util {
  constructor(server) {
    __publicField(this, "server");
    this.server = server;
  }
  /**
   * Check if the necessary folders exist, if not, create them.
   */
  checkFolders() {
    let root = join(process.cwd(), this.server.path);
    if (!existsSync(root))
      mkdirSync(root);
    if (!existsSync(join(root, "tables")))
      mkdirSync(join(root, "tables"));
    if (!existsSync(join(root, "backups")) && this.server.backup)
      mkdirSync(join(root, "backups"));
  }
  /**
   * Inserts
   */
  insert(table, data) {
    this.checkFolders();
    const path = join(process.cwd(), this.server.path, "tables", `${table}.json`);
    writeFileSync(path, data, "utf8");
  }
  /**
   * Creates a backup and returns it's id
   */
  createBackup(log = Boolean(this.server.backup)) {
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
        logger.color("Backup successfully performed", AnsiStyle.Bold) + logger.color(`
	> ID: `, AnsiStyle.Bold) + id + AnsiStyle.Reset + logger.color(`
	> Tables: `, AnsiStyle.Bold) + AnsiStyle.Reset + Object.keys(tables).join(" | ") + AnsiStyle.Reset
      );
    }
    return id;
  }
  restoreBackup(id, table, key) {
    const data = this.getBackups()[id];
    if (!data)
      return logger.error("BACKUP RESTORE FUNCTION", "Invalid ID");
    if (table && !data[table])
      return logger.error("BACKUP RESTORE FUNCTION", "Invalid TABLE");
    if (table && key && !lodashExports.get(data[table], key))
      return logger.error("BACKUP RESTORE FUNCTION", "Invalid KEY");
    const tables = Object.keys(data);
    if (table) {
      if (!tables.includes(table))
        return logger.error("BACKUP RESTORE FUNCTION", "Invalid TABLE");
      if (key) {
        const keyData = lodashExports.get(data[table], key);
        if (!keyData)
          return logger.error("BACKUP RESTORE FUNCTION", "Invalid KEY");
        lodashExports.set(data[table], key, keyData);
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
  deleteBackup(id, table, key) {
    const data = this.getBackups()[id];
    if (!data)
      return logger.error("BACKUP DELETE FUNCTION", "Invalid ID");
    if (table && !data[table])
      return logger.error("BACKUP DELETE FUNCTION", "Invalid TABLE");
    if (table && key && !lodashExports.get(data[table], key))
      return logger.error("BACKUP DELETE FUNCTION", "Invalid KEY");
    const tables = Object.keys(data);
    const root = join(process.cwd(), this.server.path, "backups", id);
    if (table) {
      if (!tables.includes(table))
        return logger.error("BACKUP DELETE FUNCTION", "Invalid TABLE");
      console.log(data[table]);
      if (key) {
        lodashExports.unset(data[table], key);
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
      for (const table2 of tables) {
        rmSync(join(root, `${table2}.json`), { force: true });
      }
      rmdirSync(root);
      return true;
    }
  }
  /**
   * Gets Tables
   */
  getTables() {
    this.checkFolders();
    const root = join(process.cwd(), this.server.path, "tables");
    const tables = readdirSync(root);
    const entries = [];
    for (const table of tables) {
      entries.push([
        table.slice(0, table.length - 5),
        JSON.parse(readFileSync(join(root, table)).toString())
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
    const entries = [];
    for (var backup of backups) {
      const tables = readdirSync(
        join(process.cwd(), this.server.path, "backups", backup)
      );
      const tablesEntries = [];
      for (const table of tables) {
        tablesEntries.push([
          table.slice(0, table.length - 5),
          JSON.parse(readFileSync(join(root, backup, table)).toString())
        ]);
      }
      entries.push([backup, Object.fromEntries(tablesEntries)]);
    }
    return Object.fromEntries(entries);
  }
}

export { Util };
