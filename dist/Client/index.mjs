import { EventEmitter } from './event.client.mjs';
import { logger, AnsiStyle } from '@/Auxiliar/logger.ts';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DatabaseClient extends EventEmitter {
  constructor(url, options) {
    super();
    /**
     * URL of the database, for example: http://localhost:3000/
     */
    __publicField(this, "url");
    /**
     * Authorization code to validate the fetches, this must be identical to the one used in the DatabaseServer.
     */
    __publicField(this, "authorization");
    this.url = new URL(url).toString();
    this.authorization = options.authorization;
  }
  async fetch(url, method, body) {
    const init = {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": this.authorization
      },
      method
    };
    if (body)
      Object.assign(init, { body: JSON.stringify(body) });
    const data = await fetch(url, init);
    try {
      const json = await data.json();
      return { data, json };
    } catch (e) {
      logger.error("Fetch", String(e));
      return {
        data
      };
    }
  }
  /**
   * Gets the latency with the server
   */
  async ping() {
    const start = Date.now();
    await this.fetch(this.url, "GET");
    return Date.now() - start;
  }
  /**
   * Checks the conection
   */
  async check(log = true, exit = true) {
    try {
      const start = Date.now();
      const { ok } = (await this.fetch(this.url, "GET")).data;
      if (log) {
        const date = /* @__PURE__ */ new Date();
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
            `	${logger.color("Latency:", AnsiStyle.Bold)}${AnsiStyle.Reset} ${logger.color(`${Date.now() - start}ms`, AnsiStyle.Underline)}`,
            AnsiStyle.Dim
          )
        );
      }
      return ok;
    } catch (e) {
      console.log(logger.error("UNEXPECTED", String(e)));
      if (exit)
        process.exit(0);
    }
  }
  async get(method) {
    switch (method || "all") {
      case "all": {
        const data = await this.fetch(this.url, "GET");
        return data.json;
      }
      case "tables": {
        const data = await this.fetch(this.url + "tables/", "GET");
        return data.json;
      }
      case "backups": {
        const data = await this.fetch(this.url + "backups/", "GET");
        return data.json;
      }
    }
  }
  async backup(method, id, table, key) {
    switch (method) {
      case "get": {
        if (!id)
          return logger.error(
            "Function Backup.Get",
            "You must provide the id of the backup to be obtained"
          );
        if (!(await this.get("backups"))[id])
          return {};
        const querys = [];
        if (id)
          querys.push(`id=${id}`);
        if (table)
          querys.push(`table=${table}`);
        if (key)
          querys.push(`key=${key}`);
        const url = this.url + `backups/get?${querys.join("&")}`;
        const data = await this.fetch(url, "GET");
        return data.json;
      }
      case "create": {
        const data = await this.fetch(this.url + "backups/create", "POST");
        return {
          success: true,
          id: data.json.id
        };
      }
      case "restore": {
        const data = await this.fetch(this.url + "backups/restore", "POST", {
          id,
          table,
          key
        });
        return data.json;
      }
      case "delete": {
        const data = await this.fetch(this.url + "backups/delete", "POST", {
          id,
          table,
          key
        });
        return data.json;
      }
    }
  }
  async table(method, table, key, value) {
    switch (method) {
      case "get": {
        const errorValue = {
          table,
          key,
          value: void 0
        };
        try {
          const querys = [];
          if (table)
            querys.push(`table=${table}`);
          if (key)
            querys.push(`key=${key}`);
          const url = this.url + `tables/get?${querys.join("&")}`;
          const data = await this.fetch(url, "GET");
          if (!data.data.ok)
            return errorValue;
          return {
            table: data.json.table,
            key: data.json.key,
            value: data.json.value
          };
        } catch (e) {
          logger.error('TABLE FUNCTION "GET"', String(e));
          return errorValue;
        }
      }
      case "set": {
        const errorValue = (ok) => {
          return {
            table: ok ? table : void 0,
            key: ok ? key : void 0,
            old: void 0,
            value: void 0
          };
        };
        try {
          const data = await this.fetch(this.url + "tables/set", "POST", {
            table,
            key,
            value
          });
          if (!data.data.ok)
            return errorValue(data.data.ok);
          return {
            table: data.json.table,
            key: data.json.key,
            old: data.json.values["old"] ?? void 0,
            value: data.json.values["new"]
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
          value: false
        };
        try {
          const querys = [];
          if (table)
            querys.push(`table=${table}`);
          if (key)
            querys.push(`key=${key}`);
          const url = this.url + `tables/delete?${querys.join("&")}`;
          const data = await this.fetch(url, "DELETE");
          if (!data.data.ok)
            return errorValue;
          return data.json;
        } catch (e) {
          logger.error('TABLE FUNCTION "DELETE"', String(e));
          return errorValue;
        }
      }
    }
  }
}

export { DatabaseClient, EventEmitter };
