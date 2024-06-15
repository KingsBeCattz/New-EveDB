import backups from "./backups.ts";
import tables from "./tables.ts";
import { RouteBody } from "@/Auxiliar/index.ts";

export type routes = "home" | "tables";

export const routes = {
	home: [
		{
			url: "/",
			method: "ANY",
			auth: false,
			code(ctx) {
				ctx.send(200, {
					tables: ctx.server.util.getTables(),
					backups: ctx.server.util.getBackups(),
				});
			},
		},
	],
	tables,
	backups,
} as Record<routes, RouteBody[]>;
