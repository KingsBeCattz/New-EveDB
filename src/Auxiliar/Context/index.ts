import { DatabaseServer, Request, Response, JSONObject } from "../../index";
import { URL } from "url";

export class Context {
	server: DatabaseServer;
	req: Request;
	res: Response;
	querys: { [k: string]: string };
	body: JSONObject | null;

	constructor(server: DatabaseServer, req: Request, res: Response) {
		this.server = server;
		this.req = req;
		this.res = res;
		this.querys = (() => {
			const parsedUrl = new URL(this.req.url!, `http://${this.req.headers.host}`);
			const regex = /[?&]([^=]+)=([^&]+)/g;
			const result: { [k: string]: string } = {};
			let match: RegExpExecArray | null;

			while ((match = regex.exec(parsedUrl.search)) !== null) {
				const key = match[1];
				const value = match[2];
				result[key] = value;
			}
			return result;
		})();

		this.body = null;
	}

	async parseBody(): Promise<void> {
		let b = "";

		this.req.on("data", (chunk) => {
			b += chunk.toString();
		});

		return new Promise((resolve, reject) => {
			this.req.on("end", () => {
				this.body = JSON.parse(b || "{}");

				resolve();
			});

			this.req.on("error", (err) => {
				reject(err);
			});
		});
	}

	/**
	 * Sends a simple JSON with a message
	 * @param res Response
	 * @param code Status code
	 * @param message Message to send
	 */
	send(code: number, data: string): void;

	/**
	 * Sends a custom JSON
	 * @param res Response
	 * @param code Status code
	 * @param message Message to send
	 */
	send(code: number, data: JSONObject): void;

	send(code: number, data: string | JSONObject) {
		this.res.writeHead(code, { "Content-Type": "application/json" });
		if (typeof data == "string") {
			this.res.end(JSON.stringify({ message: data }));
		} else {
			this.res.end(JSON.stringify(data));
		}
	}
}
