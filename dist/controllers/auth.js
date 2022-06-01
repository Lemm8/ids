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
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
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
        // GENERAR TOKEN
        const token = yield (0, generar_jwt_1.generarJWT)(usuario.id);
        // RETORNAR USUARIO Y TOKEN
        return res.status(200).json({
            status: 200,
            usuario,
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
exports.login = login;
//# sourceMappingURL=auth.js.map