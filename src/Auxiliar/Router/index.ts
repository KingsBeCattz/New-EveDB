import { Context, Methods } from "@/index";
import { routes } from "../../Routes/index";
import { logger } from "../logger";

interface RouteBody {
	url: string;
	method: Methods;
	auth: boolean;
	code: (context: Context) => any | Promise<any>;
}

class Router {
	routes: Map<string, RouteBody>;

	constructor() {
		this.routes = new Map();
	}

	async load() {
		for (const _route of Object.keys(routes) as (keyof typeof routes)[]) {
			for (const route of routes[_route]) {
				this.routes.set(route.url, route);
				// if (this.debug) maybe
				logger.info(
					"ROUTER",
					`Route Loaded:  ${route.url}\n\t> Method: ${logger.method(route.method)}`
				);
			}
		}
		return this;
	}
}

export { Router, RouteBody };
