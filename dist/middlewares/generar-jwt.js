"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarRefreshJWT = exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config({ path: process.cwd() + '/.env' });
// GENERAR JSON WEB TOKEN
const generarJWT = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // RETORNAR PROMESA 
    return new Promise((resolve, reject) => {
        const payload = { id };
        // GENERAR TOKEN CON EL PAYLOAD Y PRIVATEKEY
        jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '15m'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
});
exports.generarJWT = generarJWT;
// GENERAR JSON WEB TOKEN
const generarRefreshJWT = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // RETORNAR PROMESA 
    return new Promise((resolve, reject) => {
        const payload = { id };
        // GENERAR TOKEN CON EL PAYLOAD Y PRIVATEKEY
        jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '3d'
        }, (err, token) => {
            if (err) {
                reject('No se pudo generar el token');
            }
            else {
                resolve(token);
            }
        });
    });
});
exports.generarRefreshJWT = generarRefreshJWT;
module.exports = {
    generarJWT: exports.generarJWT,
    generarRefreshJWT: exports.generarRefreshJWT
};
//# sourceMappingURL=generar-jwt.js.map