import { Router, Response, Request, HTTPServer, Util, Context } from "../index";
import { join } from "path";
import { existsSync } from "fs";
import { createServer } from "http";
import { AnsiStyle, logger } from "../index";

export type BackupOptions = {
	/**
	 * Sets the interval to backups
	 * @typedef number
	 * @default 3600000 //One hour
	 */
	interval: number;
	/**
	 * Reports the process and handle errors
	 * @typedef boolean
	 * @default true
	 */
	report: boolean;
};

export type ServerOptions = {
	/**
	 * Port to listen
	 * @typedef number
	 */
	port: number;
	/**
	 * Path of database
	 * @typedef string
	 */
	path: string;
	/**
	 * Tables of database
	 * @typedef Array<string>
	 */
	tables: string[];
	/**
	 * Authentication code to allow requests
	 */
	auth: string;
	/**
	 * Set the backup options, if not set it will be disabled.
	 */
	backup?: BackupOptions;
};

function inspectArray(array: any[]) {
	return array.map((item) => typeof item);
}

export class DatabaseServer {
	/**
	 * HTTP Server
	 */
	app: HTTPServer<typeof Request, typeof Response> | null;
	/**
	 * Utils ;)
	 */
	util: Util;
	/**
	 * Router
	 */
	router: Router;
	/**
	 * Auth code
	 * @typedef string
	 */
	authorization: string;
	/**
	 * Port to listen
	 * @typedef number
	 */
	port: number;
	/**
	 * Path of database
	 * @typedef string
	 */
	path: string;
	/**
	 * Tables of database
	 * @typedef Array<string>
	 * @default ["main"]
	 */
	tables: string[];
	/**
	 * Backup options, if not set it will be disabled.
	 */
	backup?: BackupOptions;
	/**
	 * Constructor of the database server
	 * @param options
	 */

	constructor(options: ServerOptions) {
		if (!options) options = {} as any;
		if (typeof options?.port !== "number") {
			logger.warn("CLIENT", "Port must be a number. Setted on: 3000");
			options.port = 3000;
		}
		if (typeof options?.path !== "string") {
			logger.warn(
				"CLIENT",
				"Path must be a string. Setted on: " + join(process.cwd(), "./Database")
			);
			options.path = "./Database";
		}
		if (
			!Array.isArray(options?.tables) ||
			options?.tables.length < 1 ||
			inspectArray(options?.tables).filter((t) => t !== "string").length > 0
		) {
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
		this.backup = options.backup
			? {
					interval: options.backup.interval || 60 * 60000,
					report: options.backup.report ?? true,
			  }
			: undefined;
	}

	async start() {
		this.util.checkFolders();
		for (const table of this.tables) {
			let tablePath = join(process.cwd(), this.path, "tables", table + ".json");
			if (!existsSync(tablePath)) this.util.insert(table, "{}");
		}

		this.router.load();

		const requestListener = async (req: Request, res: Response) => {
			const { method } = req;
			res
				.setHeader("Content-Type", "application/json")
				.setHeader(
					// Permitir cualquier origen
					"Access-Control-Allow-Origin",
					"*"
				)
				.setHeader(
					// Métodos permitidos
					"Access-Control-Allow-Methods",
					"GET, POST, DELETE"
				)
				.setHeader(
					// Encabezados permitidos
					"Access-Control-Allow-Headers",
					"Origin, X-Requested-With, Content-Type, Accept, Authorization"
				)
				.setHeader("Access-Control-Allow-Credentials", "true"); // Permitir credenciales
			const ctx = new Context(this, req, res);

			const parsedUrl = new URL(req.url!, `http://${req.headers.host}`);
			const url = parsedUrl.pathname;
			const route = this.router.routes.get(url.endsWith("/") ? url : url + "/");

			if (route?.method === "POST") await ctx.parseBody();

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
			const host = this.app![sim].url.href;
			const date = new Date();

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
						`${logger.color("Ready on:", AnsiStyle.Bold)}${
							AnsiStyle.Reset
						} ${logger.color(host, AnsiStyle.Underline)}`
					),
					AnsiStyle.Dim
				),
				logger.color(
					`\t${logger.color("Authorization code:", AnsiStyle.Bold)}${
						AnsiStyle.Reset
					} ${logger.color(this.authorization, AnsiStyle.Underline)}`,
					AnsiStyle.Dim
				),
				"\n"
			);
		});
	}
}
