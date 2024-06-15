export * from "./Auxiliar";
export * from "./Server";
export * from "./Types";
export * from "./Client";
export {
	IncomingMessage as Request,
	ServerResponse as Response,
	Server as HTTPServer,
} from "http";

function Authcode(
	length: number,
	caps: boolean = true,
	lowercase: boolean = true,
	numbers: boolean = true,
	dots: boolean = false,
	symbols: boolean = false
): string {
	let characters = "";
	if (caps) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";
	if (numbers) characters += "0123456789";
	if (dots) characters += ".";
	if (symbols) characters += `!"#$%&/()=?¡¿?*+~[]{},;:-_<>`;
	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export function genAuthCode() {
	const codes = [
		Authcode(8, true, true, true, false, false),
		Authcode(8, true, true, true, false, false),
		Authcode(8, true, true, true, false, false),
		Authcode(8, true, true, true, false, false),
	];
	return codes.join(".");
}
