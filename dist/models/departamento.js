"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Departamentos extends sequelize_1.Model {
}
Departamentos.init({
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    // Other model options go here
    sequelize: connection_1.default,
    modelName: 'Departamentos' // We need to choose the model name
});
// the defined model is the class itself
console.log('Departamentos:', Departamentos === connection_1.default.models.Departamentos);
exports.default = Departamentos;
//# sourceMappingURL=departamento.js.map