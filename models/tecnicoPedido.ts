import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class TecnicoPedido extends Model {
    declare TecnicoId: number;
    declare PedidoId: number
}

TecnicoPedido.init({}, {
    sequelize: db,
    modelName: 'TecnicoPedido'
});

// the defined model is the class itself
console.log( 'TecnicoPedido:', TecnicoPedido === db.models.TecnicoPedido );

export default TecnicoPedido;