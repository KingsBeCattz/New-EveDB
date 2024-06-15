# ![EveDB Logo](/Large%20Logo.png)
A simple but complete database, with the use of tables and backup copies using JSON files and not a single dependency to any external module to those already included with node.

> <h2><b>Update</b>: <u>2.0.0</u></h2>
> EveDB code was completely rewritten for better performance and lower requirements by reducing dependencies.
> 
> <b>Date</b>: <u>06/14/24</u>

# Instalation
You can install EveDB using Bun or some package manager, the following command is in case of Bun:
```sh
npm i @kbc-studios/evedb
```
# Getting started
The use of the package is divided into two, the server and the client, which is simple to use is the server because everything is done automatically and you just configure it, however the other is the client is the one that interacts with the server, and is the one that is configured quickly but has many ways to use, first we will see the server

- # Server
  ```ts
  // ./src/server.ts/
  import { DatabaseServer } from "@kbc-studios/evedb";

  const AUTHORIZATION = "wbHt2MrH.1M6F4k6Q.gKsXA80F.L8oFD3W8";
  //Note: The code above you can set it as you like, if you want a long and random code I recommend you to use the genAuthCodef unction that is in the same package, import it, run it and copy the code it gave you.

  const server = new DatabaseServer({
	port: 3000, //Port to listen. Default: 3000
	path: "./Database", //Folder to be used. Default:  "./Database"
	tables: ["main", "test"], //Tables to be used. Default: ["main"]
	auth: AUTHORIZATION, //Code to authorize actions
	backup: { //If it is not established, automatic copies will not be made.
		interval: 60000 * 30, //Interval of backup copies
		report: true //If during the process of creating a backup copy it is logged in console or not
	},
  });

  server.start() //Starts the server, this is the only function that this class has
  ```

- # Client
  ```ts
  // ./src/index.ts
  import { DatabaseServer } from "@kbc-studios/evedb";

  const client = new DatabaseClient("http://localhost:3000", {
	authorization: AUTHORIZATION,
  });

  client.check() //Check if the server given as url is available.
  ```

# Functions and Events of the Client
