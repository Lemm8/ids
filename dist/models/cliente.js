"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const usuario_1 = __importDefault(require("./usuario"));
class Clientes extends sequelize_1.Model {
}
Clientes.init({
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Clientes',
    scopes: {
        getUsuario: function (limit, where) {
            return {
                attributes: {
                    exclude: ['UsuarioId']
                },
                limit,
                where,
                include: {
                    model: usuario_1.default,
                    required: true,
                    attributes: {
                        exclude: ['estado', 'createdAt', 'updatedAt']
                    },
                    where: {
                        estado: true
                    }
                }
            };
        },
    }
});
// the defined model is the class itself
console.log('Clientes:', Clientes === connection_1.default.models.Clientes);
exports.default = Clientes;
//# sourceMappingURL=cliente.js.map