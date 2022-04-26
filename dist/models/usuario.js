"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const cliente_1 = __importDefault(require("./cliente"));
const tecnico_1 = __importDefault(require("./tecnico"));
const encriptar_1 = require("../middlewares/encriptar");
class Usuarios extends sequelize_1.Model {
}
Usuarios.init({
    // Model attributes are defined here
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: sequelize_1.DataTypes.STRING,
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
    modelName: 'Usuarios',
    hooks: {
        afterCreate: (usuario) => {
            const contraEncriptada = (0, encriptar_1.encriptarContrasena)(usuario.contrasena);
            usuario.contrasena = contraEncriptada;
        },
        beforeSave: (usuario) => {
            if (usuario.contrasena) {
                const contraEncriptada = (0, encriptar_1.encriptarContrasena)(usuario.contrasena);
                usuario.contrasena = contraEncriptada;
            }
        }
    },
    scopes: {
        getClientes: function (limit, where) {
            return {
                limit,
                where,
                include: {
                    model: cliente_1.default,
                    required: true
                }
            };
        },
        getTecnicos: function (limit, where) {
            return {
                limit,
                where,
                include: {
                    model: tecnico_1.default,
                    required: true
                }
            };
        },
        getAdmins: function (limit, where) {
            return {
                limit,
                where,
                include: {
                    model: tecnico_1.default,
                    required: true,
                    where: {
                        is_admin: true
                    }
                }
            };
        }
    }
});
// the defined model is the class itself
console.log('Usuarios:', Usuarios === connection_1.default.models.Usuarios);
exports.default = Usuarios;
//# sourceMappingURL=usuario.js.map