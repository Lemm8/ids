import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

import Usuario from "./usuario";

class Clientes extends Model {
    declare id: number;
    declare UsuarioId: number;
    declare nombre: string;
    declare apellidos: string;
    declare direccion: string;
    declare Usuario: Usuario;
}

Clientes.init({

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
    
}, {
    
    sequelize: db, // We need to pass the connection instance
    modelName: 'Clientes', // We need to choose the model name
    scopes: {        
        getUsuario: function ( limit:number, where:any ) {
            return {
                attributes: {
                    exclude: ['UsuarioId']
                },
                limit,
                where,
                include: {
                    model: Usuario,                    
                    required: true,
                    attributes: {
                        exclude: [ 'createdAt', 'updatedAt' ]
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
console.log( 'Clientes:', Clientes === db.models.Clientes );

export default Clientes;
