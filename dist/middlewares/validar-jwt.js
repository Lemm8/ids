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
exports.isClienteOrAdmin = exports.isUsuario = exports.isTecnicoOrAdmin = exports.isAdmin = exports.isTecnico = exports.isCliente = exports.validarJWT = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // OBTENER TOKEN DEL HEADER
        const token = req.header('x-token');
        if (!token) {
            return res.status(401).json({
                status: 401,
                msg: 'El token no se encuentra en la peticion'
            });
        }
        // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
        const { id } = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3');
        // LEER USUARIO CORRESPONDIENTE
        const usuario = yield usuario_1.default.findOne({
            where: {
                id
            },
        });
        // SI USUARIO NO EXISTE
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
        // VERIFICAR SI ESTADO ES FALSE
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido'
            });
        }
        req.usuario = usuario;
        next();
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
exports.validarJWT = validarJWT;
const isCliente = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cliente = yield cliente_1.default.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        if (!cliente || !cliente.Usuario.estado) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere rol de cliente'
            });
        }
        return next();
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
exports.isCliente = isCliente;
const isTecnico = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tecnico = yield tecnico_1.default.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id, is_admin: false } });
        if (!tecnico || !tecnico.Usuario.estado) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere rol de tecnico'
            });
        }
        return next();
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
exports.isTecnico = isTecnico;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield tecnico_1.default.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        console.log(admin === null || admin === void 0 ? void 0 : admin.is_admin);
        if (!admin || !admin.Usuario.estado || !admin.is_admin) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere el rol de administrador'
            });
        }
        return next();
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
exports.isAdmin = isAdmin;
const isTecnicoOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tecnico = yield tecnico_1.default.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        if (!tecnico || !tecnico.Usuario.estado) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere rol de tecnico o de administrador'
            });
        }
        return next();
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
exports.isTecnicoOrAdmin = isTecnicoOrAdmin;
const isUsuario = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuario = yield usuario_1.default.findOne({ where: { id: req.usuario.id } });
        if (!usuario || !usuario.estado) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere ser usuario'
            });
        }
        return next();
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
exports.isUsuario = isUsuario;
const isClienteOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // BUSCAR CLIENTE
        const cliente = yield cliente_1.default.findOne({
            where: {
                UsuarioId: req.usuario.id
            },
            include: {
                model: usuario_1.default,
                required: true,
                where: {
                    estado: true
                }
            }
        });
        // BUSCAR ADMIN
        const admin = yield tecnico_1.default.findOne({
            where: {
                UsuarioId: req.usuario.id,
                is_admin: true
            },
            include: {
                model: usuario_1.default,
                required: true,
                where: {
                    estado: true
                }
            }
        });
        if (!admin && !cliente) {
            return res.status(403).json({
                status: 403,
                msg: 'Se requiere rol de cliente o de administrador'
            });
        }
        return next();
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
exports.isClienteOrAdmin = isClienteOrAdmin;
//# sourceMappingURL=validar-jwt.js.map