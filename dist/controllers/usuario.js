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
exports.postUsuario = exports.getUsuarioById = exports.getUsuario = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield usuario_1.default.findAll();
    res.json({
        usuarios
    });
});
exports.getUsuario = getUsuario;
const getUsuarioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.default.findByPk(id);
    res.json({
        usuario
    });
});
exports.getUsuarioById = getUsuarioById;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, contrasena, telefono } = req.body;
    const usuario = yield usuario_1.default.create({ correo, telefono, contrasena });
    res.json({
        msg: 'Get Usuarios',
        usuario,
    });
});
exports.postUsuario = postUsuario;
//# sourceMappingURL=usuario.js.map