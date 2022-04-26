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
exports.existePedido = exports.existeServicio = exports.existeCURP = exports.existeAdmin = exports.existenTecnicos = exports.existeTecnico = exports.existeCliente = exports.existeTelefono = exports.existeCorreo = exports.validarContrasena = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const servicio_1 = __importDefault(require("../models/servicio"));
const pedido_1 = __importDefault(require("../models/pedido"));
const validarContrasena = (contrasena) => __awaiter(void 0, void 0, void 0, function* () {
    if (contrasena) {
        const valida = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#.?&]{8,}$/.test(contrasena);
        if (!valida) {
            throw new Error('La contraseña debe tener mínimo 8 caractéres y un caractér especial');
        }
    }
});
exports.validarContrasena = validarContrasena;
// VERIFICAR SI EL CORREO EXISTE
const existeCorreo = (correo) => __awaiter(void 0, void 0, void 0, function* () {
    const existeCorreo = yield usuario_1.default.findOne({
        where: {
            correo,
            estado: true
        }
    });
    if (existeCorreo) {
        throw new Error(`Ya hay una cuenta registrada con este correo: '${correo}'`);
    }
});
exports.existeCorreo = existeCorreo;
// VERIFICAR SU EL TELEFONO EXISTE
const existeTelefono = (telefono) => __awaiter(void 0, void 0, void 0, function* () {
    const existeTelefono = yield usuario_1.default.findOne({
        where: {
            telefono,
            estado: true
        }
    });
    if (existeTelefono) {
        throw new Error(`Ya hay una cuenta registrada con este telefono: '${telefono}'`);
    }
});
exports.existeTelefono = existeTelefono;
const existeCliente = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield cliente_1.default.scope('getUsuario').findOne({
        where: {
            id
        }
    });
    if (!usuario) {
        throw new Error(`No existe un cliente con este id: '${id}'`);
    }
});
exports.existeCliente = existeCliente;
const existeTecnico = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield tecnico_1.default.scope('getUsuario').findOne({
        where: {
            id
        }
    });
    if (!usuario) {
        throw new Error(`No existe un técnico con este id: '${id}'`);
    }
});
exports.existeTecnico = existeTecnico;
const existenTecnicos = (tecnicos) => __awaiter(void 0, void 0, void 0, function* () {
    tecnicos.forEach((tecnico) => __awaiter(void 0, void 0, void 0, function* () {
        const usuario = yield tecnico_1.default.scope('getUsuario').findOne({
            where: {
                id: tecnico
            }
        });
        if (!usuario) {
            throw new Error(`No existe un técnico con este id: ${tecnico}`);
        }
    }));
});
exports.existenTecnicos = existenTecnicos;
const existeAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.default.scope('getAdmins').findOne({
        where: {
            id,
            estado: true
        }
    });
    if (!usuario) {
        throw new Error(`No existe un admin con este id: '${id}'`);
    }
});
exports.existeAdmin = existeAdmin;
const existeCURP = (curp) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield tecnico_1.default.scope('getUsuario').findOne({
        where: {
            curp
        }
    });
    if (usuario) {
        throw new Error('Ya existe un usuario registrado con este CURP');
    }
});
exports.existeCURP = existeCURP;
const existeServicio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const servicio = yield servicio_1.default.findOne({
        where: {
            id
        }
    });
    if (!servicio) {
        throw new Error(`No existe un servicio con este id: '${id}'`);
    }
});
exports.existeServicio = existeServicio;
const existePedido = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pedido = yield pedido_1.default.findOne({
        where: {
            id
        }
    });
    if (!pedido) {
        throw new Error(`No existe un pedido con este id: ${id}`);
    }
});
exports.existePedido = existePedido;
//# sourceMappingURL=db-validators.js.map