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
exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generar_jwt_1 = require("../middlewares/generar-jwt");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // DATOS DE ENTRADA DEL LOGIN
    const { correo, contrasena } = req.body;
    try {
        // ENCONTRAR USUARIO CON BASE A CORREO
        const usuario = yield usuario_1.default.findOne({ where: { correo } });
        // MANDAR MSG SI NO HAY USUARIO
        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                status: 400,
                msg: `No existe un usuario con este correo: ${correo}`
            });
        }
        // VALIDAR CONTRASENA
        const validar = bcryptjs_1.default.compareSync(contrasena, usuario.contrasena);
        if (!validar) {
            return res.status(400).json({
                status: 400,
                msg: 'La contraseña es incorrecta'
            });
        }
        let rol = '';
        if (yield cliente_1.default.findOne({ where: { UsuarioId: usuario.id } })) {
            rol = 'cliente';
        }
        else if (yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: false } })) {
            rol = 'tecnico';
        }
        else if (yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: true } })) {
            rol = 'admin';
        }
        // GENERAR TOKEN DE ACCESO Y REFRESH
        const accessToken = yield (0, generar_jwt_1.generarJWT)(usuario.id);
        const refreshToken = yield (0, generar_jwt_1.generarRefreshJWT)(usuario.id);
        // GUARDAR REFRESH TOKEN COMO HTTP ONLY PARA NO SER LEIDA EN JS
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 72 * 60 * 60 * 1000 });
        // RETORNAR USUARIO Y TOKEN
        return res.status(200).json({
            status: 200,
            usuario,
            rol,
            token: accessToken
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // BORRAR TOKEN
    // BUSCAR TOKEN EN LAS COOKIES
    const cookies = req.cookies;
    if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
        return res.status(204).json({
            error: 'No se encuentra el token en la cookies'
        });
    }
    const refreshToken = cookies.jwt;
    // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
    const { id } = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3');
    // ENCONTRAR USUARIO CON BASE A CORREO
    const usuario = yield usuario_1.default.findOne({ where: { id } });
    // BORRAR COOKIE 
    if (!usuario || !usuario.estado) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'none' });
        return res.status(204);
    }
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
});
exports.logout = logout;
//# sourceMappingURL=auth.js.map