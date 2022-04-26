import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";
import Servicio from "../models/servicio";
import Pedido from "../models/pedido";


export const validarContrasena = async ( contrasena: string ) => {

    if ( contrasena ) {
        const valida = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#.?&])[A-Za-z\d@$!%*#.?&]{8,}$/.test( contrasena );
        if ( !valida ) {
            throw new Error( 'La contraseña debe tener mínimo 8 caractéres y un caractér especial' );
        }
    }
    

}

// VERIFICAR SI EL CORREO EXISTE
export const existeCorreo = async ( correo: string ) => {
    const existeCorreo = await Usuario.findOne( {
        where: {
            correo,
            estado: true
        }
    })
    if ( existeCorreo ) {
        throw new Error( `Ya hay una cuenta registrada con este correo: '${ correo }'` );
    }
};

// VERIFICAR SU EL TELEFONO EXISTE
export const existeTelefono = async ( telefono: string ) => {
    const existeTelefono = await Usuario.findOne( {
        where: {
            telefono,
            estado: true
        } 
    });

    if( existeTelefono ) {
        throw new Error( `Ya hay una cuenta registrada con este telefono: '${ telefono }'` );
    }
}


export const existeCliente = async ( id: number ) => {
    const usuario = await Cliente.scope('getUsuario').findOne({
        where: {
            id                  
        }
    }); 

    if ( !usuario ) {
        throw new Error( `No existe un cliente con este id: '${ id }'` );
    }
}

export const existeTecnico = async ( id: number ) => {
    const usuario = await Tecnico.scope('getUsuario').findOne({
        where: {
            id
        }
    }); 

    if ( !usuario ) {
        throw new Error( `No existe un técnico con este id: '${ id }'` );
    }
}

export const existenTecnicos = async ( tecnicos: number[] ) => {
    tecnicos.forEach( async ( tecnico: number ) => {
        const usuario = await Tecnico.scope('getUsuario').findOne({
            where: {
                id: tecnico
            }
        });

        if ( !usuario ) {
            throw new Error( `No existe un técnico con este id: ${ tecnico }` );
        }
    });
}

export const existeAdmin = async ( id: number ) => {
    const usuario = await Usuario.scope('getAdmins').findOne({
        where: {
            id,
            estado: true
        }
    }); 

    if ( !usuario ) {
        throw new Error( `No existe un admin con este id: '${ id }'` );
    }
}


export const existeCURP = async( curp: string ) => {
    const usuario = await Tecnico.scope('getUsuario').findOne({
        where: {
            curp
        }
    })

    if ( usuario ) {
        throw new Error( 'Ya existe un usuario registrado con este CURP' )
    }
}


export const existeServicio = async( id: number ) => {
    const servicio = await Servicio.findOne({
        where: {
            id
        }
    }); 

    if ( !servicio ) {
        throw new Error( `No existe un servicio con este id: '${ id }'` );
    }
}


export const existePedido = async ( id: number ) => {
    const pedido = await Pedido.findOne({
       where: {
           id
       } 
    });

    if ( !pedido ) {
        throw new Error( `No existe un pedido con este id: ${id}` )
    }
}
