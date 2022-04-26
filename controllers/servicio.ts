import { Request, Response } from "express";

import db from '../db/connection';

import Servicio from "../models/servicio";



export const getServicios = async ( req: Request, res: Response ) => {

    try {
        
        // LIMITE DEFAULT
        let limit = 20;

        // OBTENER LIMITE DEL QUERY
        if ( req.query.limit ) {
            limit = parseInt( req.query.limit as any );
        }

        // OBTENER TODOS LOS RESULTADOS
        const servicios = await Servicio.findAndCountAll({ limit });

        if ( servicios.count === 0 ) { 
            return res.status( 404 ).json({
                status: 404,
                msg: "No se han encontrado registros de servicios"
            })
        }

        // RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            servicios
        });


    } catch (error) {
        console.log( error ) ;
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }

}


export const getServicio = async ( req: Request, res: Response ) => {

    try {
        
        // OBTENER ID
        const { id } = req.params;

        // BUSCAR POR ID
        let servicio = await Servicio.findOne({
            where: {
                id
            }
        });

        // RETORNAR RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            servicio
        });

    } catch (error) {

        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor'
        });

    }

}



export const postServicio = async ( req: Request, res: Response ) => {

    const result = await db.transaction( async ( t ) => {

        // OBTENER CAMPOS
        const { nombre, descripcion } = req.body;

        // CREAR SERVICIO
        let servicio = await Servicio.create({
            nombre, 
            descripcion
        });

        return res.status( 200 ).json({
            status: 200,
            msg: 'Servicio creado',
            servicio
        });
        
    });

}


export const putServicio = async ( req: Request, res: Response ) => {

    try {
        const result = await db.transaction( async ( t ) => {

            // OBTENER ID
            const { id } = req.params;
    
            // OBTENER CAMPOS 
            let { nombre, descripcion } = req.body;
    
            // BUSCAR SERVICIO
            let servicio = await Servicio.findOne({
                where: {
                    id
                }
            });
    
            if ( nombre ) servicio!.nombre = nombre;
            if ( nombre ) servicio!.descripcion = descripcion;
    
            // GUARDAR INSTANCIA
            servicio = await servicio!.save();
    
            return res.status( 200 ).json({
                status: 200,
                msg: 'Servicio actualizado',
                servicio
            });
    
        });
    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }

}




export const deleteServicio = async ( req: Request, res: Response ) => {

    try {
        const result = await db.transaction( async ( t ) => {

            const { id } = req.params;

            let servicio = await Servicio.findOne({
                where: {
                    id
                }
            });

            servicio!.estado = false;            
            await servicio!.save();

            return res.status( 200 ).json({
                status: 200,
                msg: `Servicio borrado`,
                servicio
            });

        });
    } catch (error) {
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });

    }

}

