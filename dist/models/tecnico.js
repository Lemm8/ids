"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const usuario_1 = __importDefault(require("../models/usuario"));
class Tecnicos extends sequelize_1.Model {
}
Tecnicos.init({
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
    curp: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    is_admin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    // Other model options go here
    sequelize: connection_1.default,
    modelName: 'Tecnicos',
    scopes: {
        getUsuario: function (limit, where) {
            return {
                attributes: {
                    exclude: ['UsuarioId', 'is_admin']
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
console.log('Tecnicos:', Tecnicos === connection_1.default.models.Tecnicos);
exports.default = Tecnicos;
//# sourceMappingURL=tecnico.js.map