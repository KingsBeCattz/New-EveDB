var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var AnsiStyle = /* @__PURE__ */ ((AnsiStyle2) => {
  AnsiStyle2["Reset"] = "\x1B[0m";
  AnsiStyle2["Bold"] = "1";
  AnsiStyle2["Dim"] = "2";
  AnsiStyle2["Italic"] = "3";
  AnsiStyle2["Underline"] = "4";
  AnsiStyle2["Blink"] = "5";
  AnsiStyle2["Inverse"] = "7";
  AnsiStyle2["Hidden"] = "8";
  AnsiStyle2["Strikethrough"] = "9";
  AnsiStyle2["Black"] = "30";
  AnsiStyle2["Red"] = "31";
  AnsiStyle2["Green"] = "32";
  AnsiStyle2["Yellow"] = "33";
  AnsiStyle2["Blue"] = "34";
  AnsiStyle2["Magenta"] = "35";
  AnsiStyle2["Cyan"] = "36";
  AnsiStyle2["White"] = "37";
  AnsiStyle2["BrightBlack"] = "90";
  AnsiStyle2["BrightRed"] = "91";
  AnsiStyle2["BrightGreen"] = "92";
  AnsiStyle2["BrightYellow"] = "93";
  AnsiStyle2["BrightBlue"] = "94";
  AnsiStyle2["BrightMagenta"] = "95";
  AnsiStyle2["BrightCyan"] = "96";
  AnsiStyle2["BrightWhite"] = "97";
  AnsiStyle2["BgBlack"] = "40";
  AnsiStyle2["BgRed"] = "41";
  AnsiStyle2["BgGreen"] = "42";
  AnsiStyle2["BgYellow"] = "43";
  AnsiStyle2["BgBlue"] = "44";
  AnsiStyle2["BgMagenta"] = "45";
  AnsiStyle2["BgCyan"] = "46";
  AnsiStyle2["BgWhite"] = "47";
  AnsiStyle2["BgBrightBlack"] = "100";
  AnsiStyle2["BgBrightRed"] = "101";
  AnsiStyle2["BgBrightGreen"] = "102";
  AnsiStyle2["BgBrightYellow"] = "103";
  AnsiStyle2["BgBrightBlue"] = "104";
  AnsiStyle2["BgBrightMagenta"] = "105";
  AnsiStyle2["BgBrightCyan"] = "106";
  AnsiStyle2["BgBrightWhite"] = "107";
  return AnsiStyle2;
})(AnsiStyle || {});
class Logger {
  constructor() {
    /** Prefix for log messages with EveDB styling */
    __publicField(this, "prefix", this.color(" EVE_DB ", "44" /* BgBlue */, "1" /* Bold */));
  }
  /**
   * Pads the given text to the specified length using the specified characters.
   * @param text - The text to pad.
   * @param length - The desired length of the padded text.
   * @param chars - The characters to use for padding. Defaults to a space.
   * @returns The padded text.
   */
  pad(text, length, chars = " ") {
    if (text.length >= length)
      return text;
    const start = Math.floor(length / 2) - text.length;
    const end = length - start - text.length;
    return chars.repeat(start) + text + chars.repeat(end);
  }
  /**
   * Creates an ANSI escape code string with the specified styles.
   * @param styles - The styles to apply.
   * @returns The ANSI escape code string.
   */
  createAnsiCode(...styles) {
    return `\x1B[${styles.join(";")}m`;
  }
  /**
   * Colors the given text with the specified ANSI styles.
   * @param text - The text to color.
   * @param styles - The styles to apply.
   * @returns The styled text.
   */
  color(text, ...styles) {
    return `${this.createAnsiCode(...styles)}${text}${"\x1B[0m" /* Reset */}`;
  }
  /**
   * Formats the given text by adding a tab character before each line.
   * @param text - The text to format.
   * @returns The formatted text.
   */
  format(text) {
    return `
	${text.replace(/(\n+)(\s*)/g, "$1	$2")}
`;
  }
  /**
   * Logs an informational message.
   * @param from - The source of the message.
   * @param message - The message to log.
   */
  info(from, message) {
    console.log(
      this.prefix,
      this.color(` ${from.toUpperCase()} `, "42" /* BgGreen */, "1" /* Bold */),
      this.color(" INFORMATION ", "102" /* BgBrightGreen */, "1" /* Bold */),
      this.time,
      this.color(this.format(message), "2" /* Dim */)
    );
  }
  /**
   * Logs a debug message.
   * @param from - The source of the message.
   * @param message - The message to log.
   */
  debug(from, message) {
    console.log(
      this.prefix,
      this.color(` ${from.toUpperCase()} `, "45" /* BgMagenta */, "1" /* Bold */),
      this.color(" DEBUG ", "105" /* BgBrightMagenta */, "1" /* Bold */),
      this.time,
      this.color(this.format(message), "2" /* Dim */, "3" /* Italic */)
    );
  }
  /**
   * Logs a warning message.
   * @param from - The source of the message.
   * @param message - The message to log.
   */
  warn(from, message) {
    console.log(
      this.prefix,
      this.color(` ${from.toUpperCase()} `, "43" /* BgYellow */, "1" /* Bold */),
      this.color(" WARN ", "103" /* BgBrightYellow */, "1" /* Bold */),
      this.time,
      this.color(this.format(message), "33" /* Yellow */)
    );
  }
  /**
   * Logs an error message.
   * @param from - The source of the message.
   * @param error - The error message to log.
   */
  error(from, error) {
    console.log(
      this.prefix,
      this.color(` ${from.toUpperCase()} `, "41" /* BgRed */, "1" /* Bold */),
      this.color(" ERROR ", "101" /* BgBrightRed */, "1" /* Bold */),
      this.time,
      this.color(this.format(error), "31" /* Red */)
    );
  }
  /**
   * Gets the current date and time formatted as a string.
   * @returns The formatted date and time string.
   */
  get time() {
    const date = /* @__PURE__ */ new Date();
    return this.color(
      `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
      "2" /* Dim */
    );
  }
  method(method) {
    switch (method) {
      case "GET":
        return this.color(
          ` ${method.toUpperCase()} `,
          "46" /* BgCyan */,
          "1" /* Bold */
        );
      case "POST":
        return this.color(
          ` ${method.toUpperCase()} `,
          "44" /* BgBlue */,
          "1" /* Bold */
        );
      case "PUT":
        return this.color(
          ` ${method.toUpperCase()} `,
          "43" /* BgYellow */,
          "1" /* Bold */
        );
      case "DELETE":
        return this.color(
          ` ${method.toUpperCase()} `,
          "41" /* BgRed */,
          "1" /* Bold */
        );
      default:
        return this.color(
          ` ${method.toUpperCase()} `,
          "45" /* BgMagenta */,
          "1" /* Bold */
        );
    }
  }
}
const logger = new Logger();

export { AnsiStyle, Logger, logger };
