import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

import Cliente from "./cliente";
import Tecnico from "./tecnico";

import { encriptarContrasena } from "../middlewares/encriptar";

class Usuarios extends Model {
    declare id: number;
    declare correo: string;
    declare telefono: string;
    declare contrasena: string;
    declare estado: boolean;
}

Usuarios.init({
    // Model attributes are defined here
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    contrasena: {
        type: DataTypes.STRING,
        allowNull: false
    },

    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
    
}, {
  // Other model options go here
  sequelize: db, // We need to pass the connection instance
  modelName: 'Usuarios', // We need to choose the model name
  hooks: {
    afterCreate: ( usuario ) => {
        const contraEncriptada = encriptarContrasena( usuario.contrasena );
        usuario.contrasena = contraEncriptada;
    },
    beforeSave: ( usuario ) => {
        if ( usuario.contrasena ) {
            const contraEncriptada = encriptarContrasena( usuario.contrasena );
            usuario.contrasena = contraEncriptada;
        }
    }
  },
  scopes: {
    getClientes: function ( limit:number, where:any ) {
        return { 
            limit,
            where,
            include: {
                model: Cliente,
                required: true
            }
        }
    },
    getTecnicos: function ( limit:number, where:any ) {
        return { 
            limit,
            where,
            include: {
                model: Tecnico,
                required: true
            }
        }
    },
    getAdmins: function ( limit:number, where:any ) {
        return { 
            limit,
            where,
            include: {
                model: Tecnico,
                required: true,
                where: {
                    is_admin: true
                }
            }
        }
    }
  }
});


// the defined model is the class itself
console.log( 'Usuarios:', Usuarios === db.models.Usuarios );

export default Usuarios;
