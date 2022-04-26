"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cliente_1 = __importDefault(require("../models/cliente"));
const pedido_1 = __importDefault(require("../models/pedido"));
const servicio_1 = __importDefault(require("../models/servicio"));
const tecnico_1 = __importDefault(require("../models/tecnico"));
const usuario_1 = __importDefault(require("../models/usuario"));
// UNO A UNO - CLIENTE TENDRÁ CAMPO usuarioId
usuario_1.default.hasOne(cliente_1.default, {
    onDelete: 'CASCADE'
});
cliente_1.default.belongsTo(usuario_1.default, {
    onDelete: 'CASCADE'
});
// UNO A UNO - TECNICO TENDRÁ CAMPO usuarioId
usuario_1.default.hasOne(tecnico_1.default, {
    onDelete: 'CASCADE'
});
tecnico_1.default.belongsTo(usuario_1.default, {
    onDelete: 'CASCADE'
});
// VARIOS A UNO, PEDIDO TENDRÁ CAMPOS clienteId Y servicioId
cliente_1.default.hasMany(pedido_1.default, {
    onDelete: 'CASCADE'
});
pedido_1.default.belongsTo(cliente_1.default, {
    onDelete: 'CASCADE'
});
servicio_1.default.hasMany(pedido_1.default, {
    onDelete: 'CASCADE'
});
pedido_1.default.belongsTo(servicio_1.default, {
    onDelete: 'CASCADE'
});
// MUCHOS A MUCHOS, CREARÁ TABLA TecnicoPedido
pedido_1.default.belongsToMany(tecnico_1.default, { through: 'TecnicoPedido', onDelete: 'CASCADE' });
tecnico_1.default.belongsToMany(pedido_1.default, { through: 'TecnicoPedido', onDelete: 'CASCADE' });
//# sourceMappingURL=relations.js.map