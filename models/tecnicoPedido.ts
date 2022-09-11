import { Sequelize, DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class TecnicoPedidos extends Model {
    declare TecnicoId: number;
    declare PedidoId: number
}

TecnicoPedidos.init({}, {
    sequelize: db,
    modelName: 'TecnicoPedidos'
});

// the defined model is the class itself
console.log( 'TecnicoPedidos:', TecnicoPedidos === db.models.TecnicoPedido );

export default TecnicoPedidos;