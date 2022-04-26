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
exports.deleteTecnico = exports.putTecnico = exports.postTecnico = exports.getTecnico = exports.getTecnicos = void 0;
//import { Sequelize } from 'sequelize';
const connection_1 = __importDefault(require("../db/connection"));
const usuario_1 = __importDefault(require("../models/usuario"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const getTecnicos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LIMITE DEFAULT
        let limit = 20;
        // OBTENER LIMITE SI ESTA EN EL QUERY
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        // OBTENER TECNICOS CON LIMITE 
        const tecnicos = yield tecnico_1.default.scope({ method: ['getUsuario', limit] }).findAndCountAll();
        // DEVOLVER MENSAJE SI NO HAY REGISTROS
        if (tecnicos.count == 0) {
            return res.status(404).json({
                status: 404,
                msg: 'No se han encontrado registros de Tecnicos'
            });
        }
        return res.status(200).json({
            status: 200,
            tecnicos
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
exports.getTecnicos = getTecnicos;
const getTecnico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // OBTENER ID 
        const { id } = req.params;
        // BUSCAR TECNICO POR ID
        let tecnico = yield tecnico_1.default.scope('getUsuario').findOne({
            where: {
                id
            },
        });
        return res.status(200).json({
            status: 200,
            tecnico
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
exports.getTecnico = getTecnico;
const postTecnico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // CAMPOS 
            const { correo, contrasena, telefono, nombre, apellidos, direccion, curp, is_admin } = req.body;
            // CREAR TECNICO
            let usuario = yield usuario_1.default.create({
                correo,
                telefono,
                contrasena,
                Tecnico: Object.assign({ nombre,
                    apellidos,
                    direccion,
                    curp }, (is_admin && { is_admin }))
            }, {
                include: tecnico_1.default,
                transaction: t
            });
            return res.status(200).json({
                status: 200,
                msg: 'Tecnico creado',
                usuario
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
exports.postTecnico = postTecnico;
// ACTUALIZAR TECNICO
const putTecnico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER ID Y CAMPOS A ACTUALIZAR
            const { id } = req.params;
            const { contrasena, telefono, nombre, apellidos, direccion, curp, is_admin } = req.body;
            // OBTENER TECNICO Y EL USUARIO
            let tecnico = yield tecnico_1.default.scope('getUsuario').findOne({
                where: {
                    id
                }
            });
            // ACTUALIZAR CAMPO SI ES QUE TIENE INFORMACION
            if (nombre)
                tecnico.nombre = nombre;
            if (apellidos)
                tecnico.apellidos = apellidos;
            if (curp)
                tecnico.curp = curp;
            if (direccion)
                tecnico.direccion = direccion;
            if (is_admin)
                tecnico.is_admin = is_admin;
            if (contrasena)
                tecnico.Usuario.contrasena = contrasena;
            // VALIDAR QUE TELEFONO NO EXISTA Y QUE SEA DIFERENTE AL ANTERIOR
            if (telefono) {
                const otro_telefono = yield usuario_1.default.findOne({ where: { telefono } });
                if (telefono != tecnico.Usuario.telefono && (otro_telefono === null || otro_telefono === void 0 ? void 0 : otro_telefono.id) != tecnico.Usuario.id) {
                    tecnico.Usuario.telefono = telefono;
                }
            }
            // GUARDAR INSTANCIA 
            yield tecnico.Usuario.save({ transaction: t });
            tecnico = yield tecnico.save({ transaction: t });
            return res.status(200).json({
                status: 200,
                msg: 'Tecnico actualizado',
                tecnico
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
exports.putTecnico = putTecnico;
const deleteTecnico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            let tecnico = yield tecnico_1.default.scope('getUsuario').findOne({
                where: {
                    id
                },
            });
            tecnico.Usuario.estado = false;
            yield tecnico.save();
            yield tecnico.Usuario.save();
            return res.status(200).json({
                status: 200,
                msg: `Tecnico borrado`,
                tecnico
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
exports.deleteTecnico = deleteTecnico;
//# sourceMappingURL=tecnico.js.map