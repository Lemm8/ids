import { Request, Response } from "express";

import db from "../db/connection";

import { Op } from "sequelize";

import Pedido from "../models/pedido";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";
import Servicio from "../models/servicio";
import TecnicoPedido from "../models/tecnicoPedido";


export const getPedidos = async( req: Request, res: Response ) => {

    try {
        
        // LIMITE DEFAULT
        let limit = 20;

        // OBTENER LIMITE DEL QUERY
        if ( req.query.limit ) {
            limit = parseInt( req.query.limit as any );
        }
        
        // let where = {
        //     estado: true,
        //     ...( titulo && { titulo: { [ Op.like ]: `%${ titulo }%` } } ),
        //     ...( area && { AreaId: area } ),
        //     ...( usuario && { UsuarioId: usuario } ),
        // }

        // OBTENER TODAS LOS PEDIDOS
        const pedidos = await Pedido.scope({ method: [ 'getInfo', limit ] }).findAndCountAll();

        // MANDAR MSG SI NO HAY REGISTROS
        if ( pedidos.count == 0 ) {
            return res.status( 404 ).json({
                status: 404,
                msg: 'No se han encontrado registros de pedidos'
            })
        }

        // RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            pedidos
        })

    } catch (error) {
        console.log( error ) ;
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }

}


export const getPedido = async ( req: Request, res: Response ) => {

    try {
        
        // OBTENER ID
        const { id } = req.params;

        // BUSCAR POR ID
        let pedido = await Pedido.scope( 'getInfo' ).findOne({
            where: {
                id
            }
        });

        // RETORNAR RESULTADOS
        return res.status( 200 ).json({
            status: 200,
            pedido
        })

    } catch (error) {
        console.log( error ) ;
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }

}




export const postPedido = async ( req: Request, res: Response ) => {

    try {
        
        const result = await db.transaction( async ( t ) => {
            
            // OBTENER CAMPOS
            const { cliente, tecnicos, servicio, titulo, descripcion, costo, lugar_entrega } = req.body;

            // CREAR PEDIDO
            let pedido = await Pedido.create({
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                ClienteId: cliente,
                ServicioId: servicio
            });
            
            tecnicos.forEach( async (tecnico: number) => {
                await TecnicoPedido.create({ PedidoId: pedido.id, TecnicoId: tecnico });
            });

            let clienteResult = await Cliente.scope("getUsuario").findOne({where: { id: cliente }});
            let servicioResult = await Servicio.scope("getInfo").findOne({ where: { id: servicio } });
            let tecnicosResult = await Tecnico.scope("getUsuario").findAll({where: { id: tecnicos }});

            let respuesta = {
                id: pedido.id,
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                cliente: clienteResult,
                servicio: servicioResult,
                tecnicos: tecnicosResult,
                createdAt: pedido.createdAt,
                updatedAt: pedido.updatedAt
            }

            return res.status( 200 ).json({
                status: 200,
                msg: "Pedido creado",
                pedido: respuesta,
            });

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


export const putPedido = async ( req: Request, res: Response ) => {
 
    try {
        
        const result = await db.transaction( async ( t ) => {

            // OBTENER ID
            const { id } = req.params;

            // OBTENER CAMPOS
            const { titulo, descripcion, costo, lugar_entrega, progreso } = req.body;

            // BUSCAR POR ID
            let pedido = await Pedido.scope("getInfo").findOne({ where: { id } });
            
            // ACTUALIZAR CAMPO SI TIENE INFORMACION
            if ( titulo ) pedido!.titulo = titulo;
            if ( descripcion ) pedido!.descripcion = descripcion;
            if ( costo ) pedido!.costo = costo;
            if ( lugar_entrega ) pedido!.lugar_entrega = lugar_entrega; 

            if ( progreso ) {
                switch ( progreso ) {
                    case 'En espera':
                        pedido!.progreso = progreso;
                        break;
                
                    case 'En proceso':
                        pedido!.progreso = progreso;
                        break;
        
                    case 'Listo':
                        pedido!.progreso = progreso;
                        break;
        
                    default:
                        break;
                }
            }

            pedido = await pedido!.save({ transaction: t });

            return res.status( 200 ).json({
                status: 200,
                msg: 'Pedido actualizado',
                pedido
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


export const deletePedido = async ( req: Request, res: Response ) => {

    try {
        
        const result = await db.transaction( async ( t ) => {

            const { id } = req.params;

            let pedido = await Pedido.scope("getInfo").findOne({
                where: {
                    id
                }
            });

            pedido!.estado = false;
            await pedido!.save();

            return res.status( 200 ).json({
                status: 200,
                msg: 'Pedido borrado',
                pedido
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