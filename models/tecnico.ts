import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

import Usuario from "../models/usuario";

import { encriptarContrasena } from "../middlewares/encriptar";

class Tecnicos extends Model {
    declare id: number;
    declare UsuarioId: number;
    declare nombre: string;
    declare apellidos: string;
    declare direccion: string;
    declare curp: string;
    declare is_admin: boolean;
    declare Usuario: Usuario;
}

Tecnicos.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },

    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },

    curp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    // Other model options go here
    sequelize: db, // We need to pass the connection instance
    modelName: 'Tecnicos', // We need to choose the model name
    scopes: {
        getUsuario: function ( limit:number, where:any ) {
            return {
                attributes: {
                    exclude: ['UsuarioId', 'is_admin']
                },
                limit,
                where,
                include: {
                    model: Usuario,                    
                    required: true,
                    attributes: {
                        exclude: [ 'estado', 'createdAt', 'updatedAt' ]
                    },
                    where: {
                        estado: true
                    }
                }
            }
        },
    }
});

// the defined model is the class itself
console.log( 'Tecnicos:', Tecnicos === db.models.Tecnicos );

export default Tecnicos;
