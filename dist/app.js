"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./models/server"));
require('dotenv').config({ path: process.cwd() + '/.env' });
// INSTANCIA DE SERVIDOR
const server = new server_1.default();
// LEVANTAR SERVIDOR
server.listen();
//# sourceMappingURL=app.js.map