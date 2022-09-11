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
exports.handleRefreshToken = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generar_jwt_1 = require("../middlewares/generar-jwt");
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // BUSCAR TOKEN EN LAS COOKIES
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) {
            return res.status(401).json({
                error: 'No se encuentra el token en la cookies'
            });
        }
        const refreshToken = cookies.jwt;
        // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
        const { id } = jsonwebtoken_1.default.verify(refreshToken, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3');
        // ENCONTRAR USUARIO CON BASE A CORREO
        const usuario = yield usuario_1.default.findOne({ where: { id } });
        // MANDAR MSG SI NO HAY USUARIO
        if (!usuario || !usuario.estado) {
            return res.status(400).json({
                status: 400,
                msg: `No existe este usuario`
            });
        }
        let rol = '';
        let info;
        if (yield cliente_1.default.findOne({ where: { UsuarioId: usuario.id } })) {
            rol = 'cliente';
            info = yield cliente_1.default.findOne({ where: { UsuarioId: usuario.id } });
        }
        else if (yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: false } })) {
            rol = 'tecnico';
            info = yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: false } });
        }
        else if (yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: true } })) {
            rol = 'admin';
            info = yield tecnico_1.default.findOne({ where: { UsuarioId: usuario.id, is_admin: true } });
        }
        // GENERAR TOKEN
        const token = yield (0, generar_jwt_1.generarJWT)(usuario.id);
        // RETORNAR USUARIO Y TOKEN
        return res.status(200).json({
            status: 200,
            usuario,
            info,
            rol,
            token
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
exports.handleRefreshToken = handleRefreshToken;
//# sourceMappingURL=refreshTokenController.js.map