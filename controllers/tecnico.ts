import { Request, Response } from "express";
//import { Sequelize } from 'sequelize';

import db from '../db/connection';

import Usuario from "../models/usuario";
import Tecnico from "../models/tecnico";


export const getTecnicos = async ( req: Request, res: Response ) => {
    
    try {
        
        // LIMITE DEFAULT
        let limit = 20;

        // OBTENER LIMITE SI ESTA EN EL QUERY
        if ( req.query.limit ) {
            limit = parseInt( req.query.limit as any );
        }
         
        // OBTENER TECNICOS CON LIMITE 
        const tecnicos = await Tecnico.scope( { method: [ 'getUsuario', limit  ] } ).findAndCountAll();

        // DEVOLVER MENSAJE SI NO HAY REGISTROS
        if ( tecnicos.count == 0 ) {
            return res.status( 404 ).json({
                status: 404,
                msg: 'No se han encontrado registros de Tecnicos'
            });
        }

        return res.status( 200 ).json({
            status: 200,
            tecnicos
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

export const getTecnico = async ( req: Request, res: Response ) => {

    try {
        
        // OBTENER ID 
        const { id } = req.params;

        // BUSCAR TECNICO POR ID
        let tecnico = await Tecnico.scope( 'getUsuario' ).findOne( {
            where: {
                id
            },
        });     

        return res.status( 200 ).json({
            status: 200,
            tecnico
        })

    } catch ( error ) {
        
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor'
        })

    }

    

}

export const postTecnico = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            // CAMPOS 
            const { correo, contrasena, telefono, nombre, apellidos, direccion, curp, is_admin } = req.body;  

            // CREAR TECNICO
            let usuario = await Usuario.create( {
                correo, 
                telefono, 
                contrasena,
                Tecnico: {
                    nombre,
                    apellidos, 
                    direccion,
                    curp,
                    ...( is_admin && { is_admin } )
                }
                
            }, {
                include: Tecnico,
                transaction: t
            });            
            
            return res.status( 200 ).json({
                status: 200,
                msg: 'Tecnico creado',
                usuario
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

// ACTUALIZAR TECNICO
export const putTecnico = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            // OBTENER ID Y CAMPOS A ACTUALIZAR
            const { id } = req.params;
            const { contrasena, telefono, nombre, apellidos, direccion, curp, is_admin } = req.body;

            // OBTENER TECNICO Y EL USUARIO
            let tecnico = await Tecnico.scope( 'getUsuario' ).findOne( {
                where: {
                    id
                }
            });
            
            // ACTUALIZAR CAMPO SI ES QUE TIENE INFORMACION
            if ( nombre ) tecnico!.nombre = nombre;
            if ( apellidos ) tecnico!.apellidos = apellidos;
            if ( curp ) tecnico!.curp = curp;
            if ( direccion ) tecnico!.direccion = direccion;
            if ( is_admin ) tecnico!.is_admin = is_admin;
            if ( contrasena ) tecnico!.Usuario.contrasena = contrasena;            

            // VALIDAR QUE TELEFONO NO EXISTA Y QUE SEA DIFERENTE AL ANTERIOR
            if ( telefono ) {
                const otro_telefono = await Usuario.findOne({ where: { telefono } });
                if ( telefono != tecnico!.Usuario.telefono && otro_telefono?.id != tecnico!.Usuario.id ) {
                    tecnico!.Usuario.telefono = telefono
                }
            }

            // GUARDAR INSTANCIA 
            await tecnico!.Usuario.save( { transaction: t } );
            tecnico = await tecnico!.save( { transaction: t } );

            return res.status( 200 ).json({
                status: 200,
                msg: 'Tecnico actualizado',
                tecnico
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

export const deleteTecnico = async ( req: Request, res: Response ) => {

    try {

        const result = await db.transaction( async ( t ) => {

            const { id } = req.params;

            let tecnico = await Tecnico.scope( 'getUsuario' ).findOne( {
                where: {
                    id
                },
            });   

            tecnico!.Usuario.estado = false;
            await tecnico!.save();
            await tecnico!.Usuario.save();

            return res.status( 200 ).json({
                status: 200,
                msg: `Tecnico borrado`,
                tecnico
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