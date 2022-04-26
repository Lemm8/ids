import { Request, Response } from "express";

import db from '../db/connection';

import Usuario from "../models/usuario";
import Cliente from "../models/cliente";



export const getClientes = async ( req: Request, res: Response ) => {
    
    try {
        
        // LIMITE DEFAULT
        let limit = 20;

        // OBTENER LIMITE DEL QUERY
        if ( req.query.limit ) {
            limit = parseInt( req.query.limit as any );
        }
                
        // OBTENER TODOS LOS USUARIOS
        const clientes = await Cliente.scope( { method: [ 'getUsuario', limit ] } ).findAndCountAll();

        // MANDAR MSG SI NO HAY REGISTROS
        if ( clientes.count == 0 ) {
            return res.status( 404 ).json({
                status: 404,
                msg: 'No se han encontrado registros de clientes'
            });
        }

        // RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            clientes
        });

    } catch ( error ) {       
        console.log( error ) ;
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }    

}

export const getCliente = async ( req: Request, res: Response ) => {

    try {
        
        // OBTENER ID
        const { id } = req.params;

        // BUSCAR POR ID
        let cliente = await Cliente.scope( 'getUsuario' ).findOne({
            where: {
                id
            }
        })

        // RETORNAR RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            cliente
        })

    } catch ( error ) {
        
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor'
        })

    }

    

}

export const postCliente = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            // OBTENER CAMPOS
            const { correo, contrasena, telefono, nombre, apellidos, direccion } = req.body;  

            // CREAR CLIENTE
            let cliente = await Cliente.create({
                nombre,
                apellidos, 
                direccion,
                Usuario: {
                    correo, 
                    telefono, 
                    contrasena,
                }
                
            }, {
                include: Usuario,
                transaction: t
            });            

            // REOTRNAR CLIENTE CREADO
            return res.status( 200 ).json({
                status: 200,
                msg: 'Cliente creado',
                cliente
            });

        });        

    } catch ( error ) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });

    }
    
}

export const putCliente = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            // OBTENER ID Y CAMPOS A ACTUALIZAR
            const { id } = req.params;
            const { contrasena, telefono, nombre, apellidos, direccion } = req.body;

            // OBTENER CLIENTE Y EL USUARIO
            let cliente = await Cliente.scope( 'getUsuario' ).findOne({
                where: {
                    id
                }
            })         

            // ACTUALIZAR CAMPO SI TIENE INFORMACION
            if ( nombre ) cliente!.nombre = nombre;
            if ( apellidos ) cliente!.apellidos = apellidos;
            if ( direccion ) cliente!.direccion = direccion;
            if ( contrasena ) cliente!.Usuario.contrasena = contrasena;

            // VALIDAR QUE TELEFONO NO EXISTA Y QUE SEA DIFERENTE AL ANTERIOR
            if ( telefono ) {
                const otro_telefono = await Usuario.findOne({ where: { telefono } });
                if ( telefono != cliente!.Usuario.telefono && otro_telefono?.id != cliente!.Usuario.id ) {
                    cliente!.Usuario.telefono = telefono
                } 
            }
              
            // GUARDAR INSTANCIA
            await cliente!.Usuario.save( { transaction: t } );
            cliente = await cliente!.save( { transaction: t } );

            return res.status( 200 ).json({
                status: 200,
                msg: "Cliente actualizado",
                cliente
            });

        });
        

    } catch ( error ) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }    
       
}

export const deleteCliente = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            const { id } = req.params;

            let cliente = await Cliente.scope( 'getUsuario' ).findOne({
                where: {
                    id
                }
            })

            cliente!.Usuario.estado = false;            
            await cliente!.save();
            await cliente!.Usuario.save();

            return res.status( 200 ).json({
                status: 200,
                msg: `Cliente borrado`,
                cliente
            });

        });
        

    } catch ( error ) {
        
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });

    }  

}