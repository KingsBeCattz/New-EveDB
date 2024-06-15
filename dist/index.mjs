export { Router } from './Auxiliar/Router/index.mjs';
export { Util } from './Auxiliar/Util/index.mjs';
export { Context } from './Auxiliar/Context/index.mjs';
export { AnsiStyle, Logger, logger } from './Auxiliar/logger.mjs';
export { DatabaseServer } from './Server/index.mjs';
export { DatabaseClient } from './Client/index.mjs';
export { Server as HTTPServer, IncomingMessage as Request, ServerResponse as Response } from 'http';
export { EventEmitter } from './Client/event.client.mjs';
import './Routes/index.mjs';
import './Routes/backups.mjs';
import './shared/default.e2d3b28e.mjs';
import './Routes/tables.mjs';
import 'path';
import 'fs';
import 'url';

function Authcode(length, caps = true, lowercase = true, numbers = true, dots = false, symbols = false) {
  let characters = "";
  if (caps)
    characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase)
    characters += "abcdefghijklmnopqrstuvwxyz";
  if (numbers)
    characters += "0123456789";
  if (dots)
    characters += ".";
  if (symbols)
    characters += `!"#$%&/()=?\xA1\xBF?*+~[]{},;:-_<>`;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
function genAuthCode() {
  const codes = [
    Authcode(8, true, true, true, false, false),
    Authcode(8, true, true, true, false, false),
    Authcode(8, true, true, true, false, false),
    Authcode(8, true, true, true, false, false)
  ];
  return codes.join(".");
}

export { genAuthCode };
