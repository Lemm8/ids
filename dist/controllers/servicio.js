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
exports.deleteServicio = exports.putServicio = exports.postServicio = exports.getServicio = exports.getServicios = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const servicio_1 = __importDefault(require("../models/servicio"));
const getServicios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LIMITE DEFAULT
        let limit = 20;
        // OBTENER LIMITE DEL QUERY
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        // OBTENER TODOS LOS RESULTADOS
        const servicios = yield servicio_1.default.findAndCountAll({ limit });
        if (servicios.count === 0) {
            return res.status(404).json({
                status: 404,
                msg: "No se han encontrado registros de servicios"
            });
        }
        // RESULTADOS
        return res.status(200).json({
            status: 200,
            servicios
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
exports.getServicios = getServicios;
const getServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // OBTENER ID
        const { id } = req.params;
        // BUSCAR POR ID
        let servicio = yield servicio_1.default.findOne({
            where: {
                id
            }
        });
        // RETORNAR RESULTADOS
        return res.status(200).json({
            status: 200,
            servicio
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
exports.getServicio = getServicio;
const postServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
        // OBTENER CAMPOS
        const { nombre, descripcion } = req.body;
        // CREAR SERVICIO
        let servicio = yield servicio_1.default.create({
            nombre,
            descripcion
        });
        return res.status(200).json({
            status: 200,
            msg: 'Servicio creado',
            servicio
        });
    }));
});
exports.postServicio = postServicio;
const putServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER ID
            const { id } = req.params;
            // OBTENER CAMPOS 
            let { nombre, descripcion } = req.body;
            // BUSCAR SERVICIO
            let servicio = yield servicio_1.default.findOne({
                where: {
                    id
                }
            });
            if (nombre)
                servicio.nombre = nombre;
            if (nombre)
                servicio.descripcion = descripcion;
            // GUARDAR INSTANCIA
            servicio = yield servicio.save();
            return res.status(200).json({
                status: 200,
                msg: 'Servicio actualizado',
                servicio
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
exports.putServicio = putServicio;
const deleteServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            let servicio = yield servicio_1.default.findOne({
                where: {
                    id
                }
            });
            servicio.estado = false;
            yield servicio.save();
            return res.status(200).json({
                status: 200,
                msg: `Servicio borrado`,
                servicio
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
exports.deleteServicio = deleteServicio;
//# sourceMappingURL=servicio.js.map