"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class TecnicoPedidos extends sequelize_1.Model {
}
TecnicoPedidos.init({}, {
    sequelize: connection_1.default,
    modelName: 'TecnicoPedidos'
});
// the defined model is the class itself
console.log('TecnicoPedidos:', TecnicoPedidos === connection_1.default.models.TecnicoPedido);
exports.default = TecnicoPedidos;
//# sourceMappingURL=tecnicoPedido.js.map