"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const cliente_1 = __importDefault(require("./cliente"));
const tecnico_1 = __importDefault(require("./tecnico"));
const servicio_1 = __importDefault(require("./servicio"));
class Pedidos extends sequelize_1.Model {
}
Pedidos.init({
    titulo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    costo: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    lugar_entrega: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Dirección Test'
    },
    progreso: {
        type: sequelize_1.DataTypes.ENUM('En espera', 'En proceso', 'Listo'),
        allowNull: false,
        defaultValue: 'En espera'
    },
    fecha_solicitud: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    fecha_hecho: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    fecha_entregado: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    // Other model options go here
    sequelize: connection_1.default,
    modelName: 'Pedidos',
    scopes: {
        getInfo: function (limit, where) {
            return {
                attributes: {
                    exclude: ['ClienteId', 'ServicioId']
                },
                limit,
                order: [['createdAt', 'DESC']],
                where,
                include: [
                    {
                        model: cliente_1.default,
                        required: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'UsuarioId']
                        }
                    },
                    {
                        model: servicio_1.default,
                        required: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'estado', 'descripcion']
                        }
                    },
                    {
                        model: tecnico_1.default,
                        as: 'Tecnicos',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'UsuarioId', 'TecnicoPedido']
                        }
                    }
                ]
            };
        }
    }
});
// the defined model is the class itself
console.log('Pedidos:', Pedidos === connection_1.default.models.Pedidos);
exports.default = Pedidos;
//# sourceMappingURL=pedido.js.map