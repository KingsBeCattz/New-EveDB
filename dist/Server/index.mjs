import { Router } from '../Auxiliar/Router/index.mjs';
import { Util } from '../Auxiliar/Util/index.mjs';
import { Context } from '../Auxiliar/Context/index.mjs';
import { logger, AnsiStyle } from '../Auxiliar/logger.mjs';
import '@/Auxiliar/logger.ts';
import { createServer } from 'http';
import { join } from 'path';
import { existsSync } from 'fs';
import '../Routes/index.mjs';
import '../Routes/backups.mjs';
import '../shared/default.e2d3b28e.mjs';
import '../Routes/tables.mjs';
import 'url';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function inspectArray(array) {
  return array.map((item) => typeof item);
}
class DatabaseServer {
  /**
   * Constructor of the database server
   * @param options
   */
  constructor(options) {
    /**
     * HTTP Server
     */
    __publicField(this, "app");
    /**
     * Utils ;)
     */
    __publicField(this, "util");
    /**
     * Router
     */
    __publicField(this, "router");
    /**
     * Auth code
     * @typedef string
     */
    __publicField(this, "authorization");
    /**
     * Port to listen
     * @typedef number
     */
    __publicField(this, "port");
    /**
     * Path of database
     * @typedef string
     */
    __publicField(this, "path");
    /**
     * Tables of database
     * @typedef Array<string>
     * @default ["main"]
     */
    __publicField(this, "tables");
    /**
     * Backup options, if not set it will be disabled.
     */
    __publicField(this, "backup");
    if (!options)
      options = {};
    if (typeof options?.port !== "number") {
      logger.warn("CLIENT", "Port must be a number. Setted on: 3000");
      options.port = 3e3;
    }
    if (typeof options?.path !== "string") {
      logger.warn(
        "CLIENT",
        "Path must be a string. Setted on: " + join(process.cwd(), "./Database")
      );
      options.path = "./Database";
    }
    if (!Array.isArray(options?.tables) || options?.tables.length < 1 || inspectArray(options?.tables).filter((t) => t !== "string").length > 0) {
      logger.warn(
        "CLIENT",
        'Tables must be a string array. Setted as: [ "main" ]'
      );
      options.tables = ["main"];
    }
    this.app = null;
    this.router = new Router();
    this.util = new Util(this);
    this.authorization = options.auth;
    this.port = options.port;
    this.path = options.path;
    this.tables = options.tables;
    this.backup = options.backup ? {
      interval: options.backup.interval || 60 * 6e4,
      report: options.backup.report ?? true
    } : void 0;
  }
  async start() {
    this.util.checkFolders();
    for (const table of this.tables) {
      let tablePath = join(process.cwd(), this.path, "tables", table + ".json");
      if (!existsSync(tablePath))
        this.util.insert(table, "{}");
    }
    this.router.load();
    const requestListener = async (req, res) => {
      const { method } = req;
      res.setHeader("Content-Type", "application/json").setHeader(
        // Permitir cualquier origen
        "Access-Control-Allow-Origin",
        "*"
      ).setHeader(
        // Métodos permitidos
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE"
      ).setHeader(
        // Encabezados permitidos
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      ).setHeader("Access-Control-Allow-Credentials", "true");
      const ctx = new Context(this, req, res);
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      const url = parsedUrl.pathname;
      const route = this.router.routes.get(url.endsWith("/") ? url : url + "/");
      if (route?.method === "POST")
        await ctx.parseBody();
      if (!route) {
        ctx.send(404, "Not Found " + url);
        return;
      }
      if (route.auth && req.headers["authorization"] !== this.authorization)
        return ctx.send(401, "Unauthorized");
      if (route.method === "ANY") {
        route.code(ctx);
        return;
      } else {
        if (route.method === method) {
          route.code(ctx);
          return;
        } else {
          ctx.send(405, "Method Not Allowed");
        }
      }
    };
    this.app = createServer(requestListener);
    this.app.listen(this.port, () => {
      const sim = Object.getOwnPropertySymbols(this.app)[1];
      const host = this.app[sim].url.href;
      const date = /* @__PURE__ */ new Date();
      console.log(
        logger.color(" EVE_DB ", AnsiStyle.BgBlue, AnsiStyle.Bold),
        logger.color(" SERVER ", AnsiStyle.BgBrightCyan, AnsiStyle.Bold),
        logger.color(" READY ", AnsiStyle.BgBrightGreen, AnsiStyle.Bold),
        logger.color(
          `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
          AnsiStyle.Dim
        ),
        logger.color(
          logger.format(
            `${logger.color("Ready on:", AnsiStyle.Bold)}${AnsiStyle.Reset} ${logger.color(host, AnsiStyle.Underline)}`
          ),
          AnsiStyle.Dim
        ),
        logger.color(
          `	${logger.color("Authorization code:", AnsiStyle.Bold)}${AnsiStyle.Reset} ${logger.color(this.authorization, AnsiStyle.Underline)}`,
          AnsiStyle.Dim
        ),
        "\n"
      );
    });
  }
}

export { DatabaseServer };
