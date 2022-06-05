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
exports.deletePedido = exports.putPedido = exports.postPedido = exports.getPedido = exports.getPedidos = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const sequelize_1 = require("sequelize");
const pedido_1 = __importDefault(require("../models/pedido"));
const cliente_1 = __importDefault(require("../models/cliente"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const servicio_1 = __importDefault(require("../models/servicio"));
const tecnicoPedido_1 = __importDefault(require("../models/tecnicoPedido"));
const getPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LIMITE DEFAULT
        let limit = 30;
        // OBTENER LIMITE DEL QUERY
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        let where = Object.assign(Object.assign(Object.assign(Object.assign({ estado: true }, (req.query.cliente && { ClienteId: req.query.cliente })), (req.query.servicio && { ServicioId: req.query.servicio })), (req.query.titulo && { titulo: { [sequelize_1.Op.like]: `%${req.query.titulo}%` } })), (req.query.progreso && { progreso: { [sequelize_1.Op.like]: `%${req.query.progreso}%` } }));
        // OBTENER TODAS LOS PEDIDOS
        const pedidos = yield pedido_1.default.scope({ method: ['getInfo', limit, where] }).findAndCountAll();
        // MANDAR MSG SI NO HAY REGISTROS
        if (pedidos.count == 0) {
            return res.status(404).json({
                status: 404,
                msg: 'No se han encontrado registros de pedidos'
            });
        }
        // RESULTADOS
        return res.status(200).json({
            status: 200,
            pedidos
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
exports.getPedidos = getPedidos;
const getPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // OBTENER ID
        const { id } = req.params;
        // BUSCAR POR ID
        let pedido = yield pedido_1.default.scope('getInfo').findOne({
            where: {
                id
            }
        });
        // RETORNAR RESULTADOS
        return res.status(200).json({
            status: 200,
            pedido
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
exports.getPedido = getPedido;
const postPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER CAMPOS
            const { cliente, tecnicos, servicio, titulo, descripcion, costo, lugar_entrega } = req.body;
            // CREAR PEDIDO
            let pedido = yield pedido_1.default.create({
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                ClienteId: cliente,
                ServicioId: servicio
            });
            tecnicos.forEach((tecnico) => __awaiter(void 0, void 0, void 0, function* () {
                yield tecnicoPedido_1.default.create({ PedidoId: pedido.id, TecnicoId: tecnico });
            }));
            let clienteResult = yield cliente_1.default.scope("getUsuario").findOne({ where: { id: cliente } });
            let servicioResult = yield servicio_1.default.scope("getInfo").findOne({ where: { id: servicio } });
            let tecnicosResult = yield tecnico_1.default.scope("getUsuario").findAll({ where: { id: tecnicos } });
            let respuesta = {
                id: pedido.id,
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                cliente: clienteResult,
                servicio: servicioResult,
                tecnicos: tecnicosResult,
                createdAt: pedido.createdAt,
                updatedAt: pedido.updatedAt
            };
            return res.status(200).json({
                status: 200,
                msg: "Pedido creado",
                pedido: respuesta,
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
exports.postPedido = postPedido;
const putPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            // OBTENER ID
            const { id } = req.params;
            // OBTENER CAMPOS
            const { titulo, descripcion, costo, lugar_entrega, progreso } = req.body;
            // BUSCAR POR ID
            let pedido = yield pedido_1.default.scope("getInfo").findOne({ where: { id } });
            // ACTUALIZAR CAMPO SI TIENE INFORMACION
            if (titulo)
                pedido.titulo = titulo;
            if (descripcion)
                pedido.descripcion = descripcion;
            if (costo)
                pedido.costo = costo;
            if (lugar_entrega)
                pedido.lugar_entrega = lugar_entrega;
            if (progreso) {
                switch (progreso) {
                    case 'En espera':
                        pedido.progreso = progreso;
                        break;
                    case 'En proceso':
                        pedido.progreso = progreso;
                        break;
                    case 'Listo':
                        pedido.progreso = progreso;
                        break;
                    default:
                        break;
                }
            }
            pedido = yield pedido.save({ transaction: t });
            return res.status(200).json({
                status: 200,
                msg: 'Pedido actualizado',
                pedido
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
exports.putPedido = putPedido;
const deletePedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection_1.default.transaction((t) => __awaiter(void 0, void 0, void 0, function* () {
            const { id } = req.params;
            let pedido = yield pedido_1.default.scope("getInfo").findOne({
                where: {
                    id
                }
            });
            pedido.estado = false;
            yield pedido.save();
            return res.status(200).json({
                status: 200,
                msg: 'Pedido borrado',
                pedido
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
exports.deletePedido = deletePedido;
//# sourceMappingURL=pedido.js.map