import { Methods, Context } from '@/index';

interface RouteBody {
    url: string;
    method: Methods;
    auth: boolean;
    code: (context: Context) => any | Promise<any>;
}
declare class Router {
    routes: Map<string, RouteBody>;
    constructor();
    load(): Promise<this>;
}

export { type RouteBody, Router };
