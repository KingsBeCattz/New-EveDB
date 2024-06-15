import { RouteBody } from '@/Auxiliar/index.ts';

type routes = "home" | "tables";
declare const routes: Record<routes, RouteBody[]>;

export { routes };
