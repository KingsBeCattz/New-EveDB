import { URL } from 'url';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Context {
  constructor(server, req, res) {
    __publicField(this, "server");
    __publicField(this, "req");
    __publicField(this, "res");
    __publicField(this, "querys");
    __publicField(this, "body");
    this.server = server;
    this.req = req;
    this.res = res;
    this.querys = (() => {
      const parsedUrl = new URL(this.req.url, `http://${this.req.headers.host}`);
      const regex = /[?&]([^=]+)=([^&]+)/g;
      const result = {};
      let match;
      while ((match = regex.exec(parsedUrl.search)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
      }
      return result;
    })();
    this.body = null;
  }
  async parseBody() {
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
  send(code, data) {
    this.res.writeHead(code, { "Content-Type": "application/json" });
    if (typeof data == "string") {
      this.res.end(JSON.stringify({ message: data }));
    } else {
      this.res.end(JSON.stringify(data));
    }
  }
}

export { Context };
