import { Methods } from '@/Types';

declare enum AnsiStyle {
    Reset = "\u001B[0m",
    Bold = "1",
    Dim = "2",
    Italic = "3",
    Underline = "4",
    Blink = "5",
    Inverse = "7",
    Hidden = "8",
    Strikethrough = "9",
    Black = "30",
    Red = "31",
    Green = "32",
    Yellow = "33",
    Blue = "34",
    Magenta = "35",
    Cyan = "36",
    White = "37",
    BrightBlack = "90",
    BrightRed = "91",
    BrightGreen = "92",
    BrightYellow = "93",
    BrightBlue = "94",
    BrightMagenta = "95",
    BrightCyan = "96",
    BrightWhite = "97",
    BgBlack = "40",
    BgRed = "41",
    BgGreen = "42",
    BgYellow = "43",
    BgBlue = "44",
    BgMagenta = "45",
    BgCyan = "46",
    BgWhite = "47",
    BgBrightBlack = "100",
    BgBrightRed = "101",
    BgBrightGreen = "102",
    BgBrightYellow = "103",
    BgBrightBlue = "104",
    BgBrightMagenta = "105",
    BgBrightCyan = "106",
    BgBrightWhite = "107"
}
declare class Logger {
    private prefix;
    pad(text: string, length: number, chars?: string): string;
    createAnsiCode(...styles: string[]): string;
    color(text: string, ...styles: string[]): string;
    format(text: string): string;
    info(from: string, message: string): void;
    debug(from: string, message: string): void;
    warn(from: string, message: string): void;
    error(from: string, error: string): void;
    private get time();
    method(method: Methods): string;
}
declare const logger: Logger;

export { AnsiStyle, Logger, logger };
