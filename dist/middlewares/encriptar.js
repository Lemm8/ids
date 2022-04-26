"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encriptarContrasena = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ENCRIPTAR CONTRASEÑA  -  10 VUELTAS POR DEFECTO
const encriptarContrasena = (contrasena) => {
    const salt = bcryptjs_1.default.genSaltSync();
    const hash_contrasena = bcryptjs_1.default.hashSync(contrasena, salt);
    return hash_contrasena;
};
exports.encriptarContrasena = encriptarContrasena;
//# sourceMappingURL=encriptar.js.map