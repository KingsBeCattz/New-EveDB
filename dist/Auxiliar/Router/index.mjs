import { routes } from '../../Routes/index.mjs';
import { logger } from '../logger.mjs';
import '../../Routes/backups.mjs';
import '../../shared/default.e2d3b28e.mjs';
import '../../Routes/tables.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Router {
  constructor() {
    __publicField(this, "routes");
    this.routes = /* @__PURE__ */ new Map();
  }
  async load() {
    for (const _route of Object.keys(routes)) {
      for (const route of routes[_route]) {
        this.routes.set(route.url, route);
        logger.info(
          "ROUTER",
          `Route Loaded:  ${route.url}
	> Method: ${logger.method(route.method)}`
        );
      }
    }
    return this;
  }
}

export { Router };
