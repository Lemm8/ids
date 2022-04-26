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
exports.deleteCliente = exports.putCliente = exports.postCliente = exports.getCliente = exports.getClientes = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const usuario_1 = __importDefault(require("../models/usuario"));
const cliente_1 = __importDefault(require("../models/cliente"));
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LIMITE DEFAULT
        let limit = 20;
        // OBTENER LIMITE DEL QUERY
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        // OBTENER TODOS LOS USUARIOS
        const clientes = yield cliente_1.default.scope({ method: ['getUsuario', limit] }).findAndCountAll();
        // MANDAR MSG SI NO HAY REGISTROS
        if (clientes.count == 0) {
            return res.status(404).json({
                status: 404,
                msg: 'No se han encontrado registros de clientes'
            });
        }
        // RESULTADOS
        return res.status(200).json({
            status: 200,
            clientes
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
exports.getClientes = getClientes;
const getCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // OBTENER ID
        const { id } = req.params;
        // BUSCAR POR ID
        let cliente = yield cliente_1.default.scope('getUsuario').findOne({
            where: {
                id
            }
        });
        // RETORNAR RESULTADOS
        return res.status(200).json({
            status: 200,
            cliente
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            msg: 'Error en el servidor'
        });
    }
});
exports.getCliente = getCliente;
const postCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER CAMPOS
            const { correo, contrasena, telefono, nombre, apellidos, direccion } = req.body;
            // CREAR CLIENTE
            let cliente = yield cliente_1.default.create({
                nombre,
                apellidos,
                direccion,
                Usuario: {
                    correo,
                    telefono,
                    contrasena,
                }
            }, {
                include: usuario_1.default,
                transaction: t
            });
            // REOTRNAR CLIENTE CREADO
            return res.status(200).json({
                status: 200,
                msg: 'Cliente creado',
                cliente
            });
        }));
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
exports.postCliente = postCliente;
const putCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER ID Y CAMPOS A ACTUALIZAR
            const { id } = req.params;
            const { contrasena, telefono, nombre, apellidos, direccion } = req.body;
            // OBTENER CLIENTE Y EL USUARIO
            let cliente = yield cliente_1.default.scope('getUsuario').findOne({
                where: {
                    id
                }
            });
            // ACTUALIZAR CAMPO SI TIENE INFORMACION
            if (nombre)
                cliente.nombre = nombre;
            if (apellidos)
                cliente.apellidos = apellidos;
            if (direccion)
                cliente.direccion = direccion;
            if (contrasena)
                cliente.Usuario.contrasena = contrasena;
            // VALIDAR QUE TELEFONO NO EXISTA Y QUE SEA DIFERENTE AL ANTERIOR
            if (telefono) {
                const otro_telefono = yield usuario_1.default.findOne({ where: { telefono } });
                if (telefono != cliente.Usuario.telefono && (otro_telefono === null || otro_telefono === void 0 ? void 0 : otro_telefono.id) != cliente.Usuario.id) {
                    cliente.Usuario.telefono = telefono;
                }
            }
            // GUARDAR INSTANCIA
            yield cliente.Usuario.save({ transaction: t });
            cliente = yield cliente.save({ transaction: t });
            return res.status(200).json({
                status: 200,
                msg: "Cliente actualizado",
                cliente
            });
        }));
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
exports.putCliente = putCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            let cliente = yield cliente_1.default.scope('getUsuario').findOne({
                where: {
                    id
                }
            });
            cliente.Usuario.estado = false;
            yield cliente.save();
            yield cliente.Usuario.save();
            return res.status(200).json({
                status: 200,
                msg: `Cliente borrado`,
                cliente
            });
        }));
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
});
exports.deleteCliente = deleteCliente;
//# sourceMappingURL=cliente.js.map