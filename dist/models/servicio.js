"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Servicios extends sequelize_1.Model {
}
Servicios.init({
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    // Other model options go here
    sequelize: connection_1.default,
    modelName: 'Servicios',
    scopes: {
        getInfo: function (limit, where) {
            return {
                attributes: {
                    exclude: ['estado']
                }
            };
        }
    }
});
// the defined model is the class itself
console.log('Servicios:', Servicios === connection_1.default.models.Servicios);
exports.default = Servicios;
//# sourceMappingURL=servicio.js.map