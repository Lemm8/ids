"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class TecnicoPedido extends sequelize_1.Model {
}
TecnicoPedido.init({}, {
    sequelize: connection_1.default,
    modelName: 'TecnicoPedido'
});
// the defined model is the class itself
console.log('TecnicoPedido:', TecnicoPedido === connection_1.default.models.TecnicoPedido);
exports.default = TecnicoPedido;
//# sourceMappingURL=tecnicoPedido.js.map