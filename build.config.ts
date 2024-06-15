import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
	entries: [
		"src/Auxiliar/Context/index.ts",
		"src/Auxiliar/Router/index.ts",
		"src/Auxiliar/Util/index.ts",
		"src/Auxiliar/logger.ts",
		"src/Auxiliar/index.ts",
		"src/Client/event.client.ts",
		"src/Client/index.ts",
		"src/Routes/backups.ts",
		"src/Routes/tables.ts",
		"src/Routes/index.ts",
		"src/Server/index.ts",
		"src/Types/index.ts",
		"src/index.ts",
	],
	outDir: "dist",
	declaration: "compatible",
	failOnWarn: false,
});
