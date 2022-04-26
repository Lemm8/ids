import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class Servicios extends Model {
    declare id: number;
    declare nombre: string;
    declare descripcion: string;
    declare estado: boolean;
}

Servicios.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    descripcion: {
        type: DataTypes.TEXT,
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
     modelName: 'Servicios', // We need to choose the model name
     scopes: {
         getInfo: function( limit: number, where: any ) {
             return {
                 attributes: {
                     exclude: [ 'estado' ]
                 }
             }
         }
     }
});

// the defined model is the class itself
console.log( 'Servicios:', Servicios === db.models.Servicios );

export default Servicios;
