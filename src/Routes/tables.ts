import { JSONValue, RouteBody } from "../";
import { get, set, unset } from "lodash";
import { logger } from "../Auxiliar/logger";

export default [
	{
		url: "/tables/",
		method: "ANY",
		auth: false,
		code(ctx) {
			ctx.send(200, ctx.server.util.getTables());
		},
	},
	{
		url: "/tables/get/",
		method: "GET",
		auth: false,
		code(ctx) {
			const { key, table } = ctx.querys;
			const data = ctx.server.util.getTables()[table];
			if (!data) return ctx.send(404, "Table not found");
			ctx.send(200, {
				table,
				key,
				value: get(data, key),
			});
		},
	},
	{
		url: "/tables/delete/",
		method: "DELETE",
		auth: false,
		code(ctx) {
			const { key, table } = ctx.querys;
			const data = ctx.server.util.getTables()[table];
			if (!data) return ctx.send(404, "Table not found");
			try {
				if (!key) {
					ctx.server.util.insert(table, "{}");
					ctx.send(200, {
						table,
						value: true,
					});
				} else {
					unset(data, key);
					ctx.server.util.insert(table, JSON.stringify(data, null, 2));
					ctx.send(200, {
						table,
						key,
						value: true,
					});
				}
			} catch (e) {
				logger.error("table delete", String(e));
				ctx.send(500, {
					table,
					key: key ?? null,
					value: false,
				});
			}
		},
	},
	{
		url: "/tables/set/",
		method: "POST",
		auth: false,
		code(ctx) {
			const { key, table, value } = ctx.body as {
				key: string;
				table: string;
				value: JSONValue;
			};

			const data = ctx.server.util.getTables()[table];
			if (!data) return ctx.send(404, "Table not found");
			const _value = get(data, key) || null;
			set(data, key, value);
			ctx.server.util.insert(table, JSON.stringify(data, null, 2));
			ctx.send(200, {
				table,
				key,
				values: {
					old: _value,
					new: value,
				},
			});
		},
	},
] as RouteBody[];
