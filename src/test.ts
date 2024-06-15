import { DatabaseServer, DatabaseClient, logger } from "./index";

const AUTHORIZATION = "wbHt2MrH.1M6F4k6Q.gKsXA80F.L8oFD3W8";

const server = new DatabaseServer({
	port: 3000,
	path: "./Database",
	tables: ["main", "test"],
	auth: AUTHORIZATION,
	backup: {
		interval: 60000 * 30,
		report: true,
	},
});

server.start();

const client = new DatabaseClient("http://localhost:3000", {
	authorization: AUTHORIZATION,
});

client.check();

client.table("delete", "main").then(console.log);
