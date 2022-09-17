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
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config({ path: process.cwd() + '/.env' });
const htmlCreado = (pedido, servicio) => {
    let html = `<h1>Haz realizado un pedido</h1><hr>
                    <h5>Se creo tu pedido con el titulo: ${pedido.titulo}</h5>
                    <h5>Ahora el pedido está en espera, dentro de los siguientes días estarás recibiendo actualizaciones sobre tu pedido, checa tu correo!</h5>
                    <h5>Id de tu pedido: ${pedido.id}</h5>
                    <h5>Servicio: ${servicio}</h5><hr>`;
    return html;
};
const htmlActualizacion = (tecnicos, nota, progreso, pedido, servicio) => {
    const tecnicosList = tecnicos.map(tecnico => `<li>${tecnico}</li>`);
    let html = `<h1>Tu pedido se ha actualizado</h1><hr>
                    <h5>Tu pedido con el titulo: "${pedido.titulo}" se actualizó</h5>
                    <h5>El pedido está: ${progreso}</h5>
                    <h5>Servicio: ${servicio.nombre}</h5><hr>`;
    nota === undefined || nota === ''
        ? html = html.concat(`<h5>Cualquier duda, puede contactar a uno de los técnicos encargados</h5><ul>${tecnicosList}</ul>`)
        : html = html.concat(`<h5>Nota de actualización: ${nota}</h5>`, `<h5>Cualquier duda, puede contactar a uno de los técnicos encargados</h5><ul>${tecnicosList}</ul>`);
    return html;
};
const htmlListo = (pedido, tecnicos) => {
    const tecnicosList = tecnicos.map(tecnico => `<li>${tecnico.nombre}</li>`);
    return `<h1>Tu pedido está listo</h1><hr>
            <h3>El pedido ${pedido.titulo} está listo</h3>
            <h3>Técnicos encargados:</h3><ul>${tecnicosList}</ul>
            <h3>Costo total del pedido: ${pedido.costo}</h3>
            <h5>Fecha de solicitud: ${pedido.fecha_solicitud}</h5>
            <h5>Fecha de completo: ${pedido.updatedAt}</h5>`;
};
let transporter = nodemailer_1.default.createTransport({
    name: 'idslapaz.com',
    host: process.env.HOSTNAME,
    port: 26,
    secure: false,
    auth: {
        user: process.env.CONTACT_MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});
const getPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LIMITE DEFAULT
        let limit = 30;
        // OBTENER LIMITE DEL QUERY
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        let where = Object.assign(Object.assign(Object.assign(Object.assign({ estado: true }, (req.query.cliente && { ClienteId: req.query.cliente })), (req.query.servicio && { ServicioId: req.query.servicio })), (req.query.titulo && { titulo: { [sequelize_1.Op.like]: `%${req.query.titulo}%` } })), (req.query.progreso && { progreso: { [sequelize_1.Op.like]: `%${req.query.progreso}%` } }));
        let whereTecnico = Object.assign({}, (req.query.tecnico && { id: req.query.tecnico }));
        // OBTENER TODAS LOS PEDIDOS
        const pedidos = yield pedido_1.default.scope({ method: ['getInfo', limit, where, whereTecnico] }).findAndCountAll();
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
            const { cliente, servicio, titulo, descripcion, costo, lugar_entrega } = req.body;
            // CREAR PEDIDO
            let pedido = yield pedido_1.default.create({
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                ClienteId: cliente,
                ServicioId: servicio
            });
            let clienteResult = yield cliente_1.default.scope("getUsuario").findOne({ where: { UsuarioId: cliente } });
            let servicioResult = yield servicio_1.default.scope("getInfo").findOne({ where: { id: servicio } });
            let respuesta = {
                id: pedido.id,
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                cliente: clienteResult,
                servicio: servicioResult,
                createdAt: pedido.createdAt,
                updatedAt: pedido.updatedAt
            };
            const info = yield transporter.sendMail({
                from: process.env.CONTACT_MAIL,
                to: clienteResult.Usuario.correo,
                subject: "Actualización de pedido",
                html: htmlCreado(pedido, servicioResult.nombre)
            });
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
            const { titulo, descripcion, costo, lugar_entrega, progreso, tecnicos, nota } = req.body;
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
            // ACTUALIZAR TECNICOS
            if (tecnicos !== undefined || tecnicos.length !== 0) {
                tecnicos.forEach((tecnico) => __awaiter(void 0, void 0, void 0, function* () {
                    const existeTecnico = yield tecnicoPedido_1.default.findOne({ where: { TecnicoId: tecnico, PedidoId: id } });
                    if (!existeTecnico) {
                        yield tecnicoPedido_1.default.create({ PedidoId: id, TecnicoId: tecnico });
                    }
                }));
            }
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
            const cliente = yield cliente_1.default.scope("getUsuario").findOne({ where: { id: pedido.Cliente.id } });
            const tecnicos_id = pedido.Tecnicos.map(tecnico => tecnico.id);
            const tecnicos_info = yield tecnico_1.default.scope("getUsuario").findAll({ where: { id: tecnicos_id } });
            const tecnicos_correo = tecnicos_info.map(tecnico => tecnico.Usuario.correo);
            const info = yield transporter.sendMail({
                from: process.env.CONTACT_MAIL,
                to: cliente === null || cliente === void 0 ? void 0 : cliente.Usuario.correo,
                subject: "Actualización de pedido",
                html: progreso === 'Listo'
                    ? htmlListo(pedido, pedido.Tecnicos)
                    : htmlActualizacion(tecnicos_correo, nota, progreso, pedido, pedido.Servicio)
            });
            console.log(info);
            return res.status(200).json({
                status: 200,
                msg: 'Pedido actualizado',
                pedido
            });
        }));
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 500,
            msg: 'Error en el servidor',
            error: error
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