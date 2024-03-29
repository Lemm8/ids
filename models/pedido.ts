import {  DataTypes, Model } from 'sequelize';
import db from '../db/connection';

import Cliente from "./cliente";
import Tecnico from "./tecnico";
import Servicio from "./servicio";
import Usuarios from './usuario';

class Pedidos extends Model {
    declare id: number;
    declare ClienteId: number;
    declare ServicioId: number;
    declare titulo: string;
    declare descripcion: string;
    declare costo: number;
    declare lugar_entrega: string;
    declare progreso: string;
    declare fecha_solicitud: Date;
    declare fecha_hecho: Date;
    declare fecha_entregado: Date;
    declare estado: boolean;
    declare createdAt: string;
    declare updatedAt: string;
    declare Tecnicos: Array<Tecnico>;
    declare Usuario: Usuarios;
    declare Cliente: Cliente;
    declare Servicio: Servicio;
}

Pedidos.init({
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    costo: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    lugar_entrega: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Dirección Test'
    },

    progreso: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'En espera',
        validate: {
            customValidator: ( value: string ) => {
                const enums = [ 'En espera', 'En proceso', 'Listo' ];
                if (!enums.includes(value)) {
                    throw new Error('El valor no es valido');
                }
            }
        }
    },

    fecha_solicitud: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    fecha_hecho: {
        type: DataTypes.DATE,
        allowNull: true
    },

    fecha_entregado: {
        type: DataTypes.DATE,
        allowNull: true,
    },

    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {

    // Other model options go here
    sequelize: db, // We need to pass the connection instance
    modelName: 'Pedidos', // We need to choose the model name
    scopes: {
        getInfo: function ( limit: number, where: any, whereTecnico: any ) {
            return {
                attributes: {
                    exclude: [ 'ClienteId', 'ServicioId' ]
                },
                limit,
                order: [[ 'createdAt', 'DESC' ]],
                where,
                include:[
                    {
                        model: Cliente,
                        required: true,
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'UsuarioId' ]
                        }
                    },
                    {
                        model: Servicio,
                        required: true,
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'estado', 'descripcion' ]
                        }
                    },
                    {
                        model: Tecnico,
                        as: 'Tecnicos',
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'UsuarioId', 'TecnicoPedido' ]
                        }, 
                        where: whereTecnico
                    }
                ]
            }
        }
    }
    
});


// the defined model is the class itself
console.log( 'Pedidos:', Pedidos === db.models.Pedidos );

export default Pedidos;
