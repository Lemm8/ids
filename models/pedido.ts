import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";
import Servicio from "../models/servicio";

class Pedidos extends Model {
    declare id: number;
    declare titulo: string;
    declare descripcion: string;
    declare costo: number;
    declare lugar_entrega: string;
    declare progreso: string;
    declare fecha_solicitud: Date;
    declare fecha_hecho: Date;
    declare fecha_entregado: Date;
    declare estado: boolean;
    declare cliente: Cliente;
    declare servicio: Servicio;
    declare createdAt: string;
    declare updatedAt: string;
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
        type: DataTypes.ENUM( 'En espera', 'En proceso', 'Listo' ),
        allowNull: false,
        defaultValue: 'En espera'
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
        getInfo: function ( limit: number, where: any ) {
            return {
                attributes: {
                    exclude: [ 'ClienteId', 'ServicioId' ]
                },
                limit,
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
                        required: true,
                        attributes: {
                            exclude: [ 'createdAt', 'updatedAt', 'UsuarioId', 'TecnicoPedido' ]
                        }
                    }
                ]
            }
        }
    }
    
});


// the defined model is the class itself
console.log( 'Pedidos:', Pedidos === db.models.Pedidos );

export default Pedidos;
