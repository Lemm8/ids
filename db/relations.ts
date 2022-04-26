import Cliente from "../models/cliente";
import Pedido from "../models/pedido";
import Servicio from "../models/servicio";
import Tecnico from "../models/tecnico";
import Usuario from "../models/usuario";

// UNO A UNO - CLIENTE TENDRÁ CAMPO usuarioId
Usuario.hasOne( Cliente, {
    onDelete: 'CASCADE'
})
Cliente.belongsTo( Usuario, {
    onDelete: 'CASCADE'
});

// UNO A UNO - TECNICO TENDRÁ CAMPO usuarioId
Usuario.hasOne( Tecnico, {
    onDelete: 'CASCADE'
})
Tecnico.belongsTo( Usuario, {
    onDelete: 'CASCADE'
})


// VARIOS A UNO, PEDIDO TENDRÁ CAMPOS clienteId Y servicioId
Cliente.hasMany( Pedido, {
    onDelete: 'CASCADE'
});
Pedido.belongsTo( Cliente, {
    onDelete: 'CASCADE'
});

Servicio.hasMany( Pedido, {
    onDelete: 'CASCADE'
});
Pedido.belongsTo( Servicio, {
    onDelete: 'CASCADE'
});

// MUCHOS A MUCHOS, CREARÁ TABLA TecnicoPedido
Pedido.belongsToMany( Tecnico, { through: 'TecnicoPedido', onDelete: 'CASCADE' } );
Tecnico.belongsToMany( Pedido, { through: 'TecnicoPedido', onDelete: 'CASCADE' } );

