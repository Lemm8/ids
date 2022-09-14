import { Request, Response } from "express";

import db from "../db/connection";

import { Op } from "sequelize";

import Pedido from "../models/pedido";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";
import Servicio from "../models/servicio";
import TecnicoPedidos from "../models/tecnicoPedido";

import nodemailer from 'nodemailer';
require('dotenv').config({ path: process.cwd()+'/.env' });

const htmlCreado = ( pedido: Pedido, servicio: String ) => {        
    let html = `<h1>Haz realizado un pedido</h1><hr>
                    <h5>Tu pedido con el titulo: ${pedido.titulo} se actualizó</h5>
                    <h5>Ahora el pedido está en espera, dentro de los siguientes días estarás recibiendo actualizaciones sobre tu pedido, checa tu correo!</h5>
                    <h5>Id de tu pedido: ${pedido.id}</h5>
                    <h5>Servicio: ${servicio}</h5><hr>`;
    
    return html
}

const htmlActualizacion = ( tecnicos: string[], nota: string, progreso: string, pedido: Pedido, servicio: Servicio ) => {    
    const tecnicosList = tecnicos.map( tecnico => `<li>${ tecnico }</li>` );
    let html = `<h1>Tu pedido se ha actualizado</h1><hr>
                    <h5>Tu pedido con el titulo: "${pedido.titulo}" se actualizó</h5>
                    <h5>El pedido está: ${progreso}</h5>
                    <h5>Servicio: ${servicio.nombre}</h5><hr>`;

    nota === undefined || nota === '' 
        ? html = html.concat( 
            `<h5>Cualquier duda, puede contactar a uno de los técnicos encargados</h5><ul>${tecnicosList}</ul>`)
        : html = html.concat( 
            `<h5>Nota de actualización: ${nota}</h5>`,
            `<h5>Cualquier duda, puede contactar a uno de los técnicos encargados</h5><ul>${tecnicosList}</ul>` 
        );
    
    return html
}

const htmlListo = ( pedido: Pedido, tecnicos: Tecnico[] ) => {
    const tecnicosList = tecnicos.map( tecnico => `<li>${tecnico.nombre}</li>` )

    return `<h1>Tu pedido está listo</h1><hr>
            <h3>El pedido ${pedido.titulo} está listo</h3>
            <h3>Técnicos encargados:</h3><ul>${tecnicosList}</ul>
            <h3>Costo total del pedido: ${ pedido.costo }</h3>
            <h5>Fecha de solicitud: ${pedido.fecha_solicitud}</h5>
            <h5>Fecha de completo: ${pedido.updatedAt}</h5>`
}

let transporter = nodemailer.createTransport({
    name: 'idslapaz.com',
    host: process.env.HOSTNAME,
    port: 26,
    secure: false,
    auth: {
        user: process.env.CONTACT_MAIL,
        pass: process.env.MAIL_PASSWORD
    }
});

export const getPedidos = async( req: Request, res: Response ) => {

    try {
        
        // LIMITE DEFAULT
        let limit = 30;

        // OBTENER LIMITE DEL QUERY
        if ( req.query.limit ) {
            limit = parseInt( req.query.limit as any );
        }
        
        let where = {
            estado: true,
            ...( req.query.cliente && { ClienteId: req.query.cliente } ),
            // ...( req.query.tecnico && { Tecnicos: [req.query.tecnico] } ),
            ...( req.query.servicio && { ServicioId: req.query.servicio } ),
            ...( req.query.titulo && { titulo: { [ Op.like ]: `%${ req.query.titulo }%` } } ),
            ...( req.query.progreso && { progreso: { [ Op.like ]: `%${ req.query.progreso }%` } } ),
        }

        let whereTecnico = {
            ...( req.query.tecnico && { id: req.query.tecnico } )
        }

        // OBTENER TODAS LOS PEDIDOS
        const pedidos = await Pedido.scope({ method: [ 'getInfo', limit, where, whereTecnico ] }).findAndCountAll();

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
            const { cliente, servicio, titulo, descripcion, costo, lugar_entrega } = req.body;            

            // CREAR PEDIDO
            let pedido = await Pedido.create({
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                ClienteId: cliente,
                ServicioId: servicio
            });
            
            let clienteResult = await Cliente.scope("getUsuario").findOne({where: { UsuarioId: cliente }});
            let servicioResult = await Servicio.scope("getInfo").findOne({ where: { id: servicio } });

            let respuesta = {
                id: pedido.id,
                titulo,
                descripcion,
                costo,
                lugar_entrega,
                cliente: clienteResult,
                servicio: servicioResult,
                createdAt: pedido.createdAt,
                updatedAt: pedido.updatedAt
            }

            const info = await transporter.sendMail({
                from: process.env.CONTACT_MAIL,
                to: cliente?.Usuario.correo,
                subject: "Actualización de pedido",
                html: htmlCreado( pedido, servicioResult!.nombre )
            })

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
            const { titulo, descripcion, costo, lugar_entrega, progreso, tecnicos, nota } = req.body;

            // BUSCAR POR ID
            let pedido = await Pedido.scope("getInfo").findOne({ where: { id } });
            
            // ACTUALIZAR CAMPO SI TIENE INFORMACION
            if ( titulo ) pedido!.titulo = titulo;
            if ( descripcion ) pedido!.descripcion = descripcion;
            if ( costo ) pedido!.costo = costo;
            if ( lugar_entrega ) pedido!.lugar_entrega = lugar_entrega;                      

            // ACTUALIZAR TECNICOS
            if ( tecnicos !== undefined || tecnicos.length !== 0 ) {
                tecnicos.forEach( async (tecnico: number) => {
                    const existeTecnico = await TecnicoPedidos.findOne( { where: { TecnicoId: tecnico, PedidoId: id } } );                    
                    if ( !existeTecnico ) {
                        await TecnicoPedidos.create({ PedidoId: id, TecnicoId: tecnico });
                    }
                });
            }             

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
            const cliente = await Cliente.scope("getUsuario").findOne({ where: { id: pedido.Cliente.id } })
            const tecnicos_id = pedido.Tecnicos.map( tecnico => tecnico.id );
            const tecnicos_info = await Tecnico.scope("getUsuario").findAll({ where: { id: tecnicos_id } });
            const tecnicos_correo = tecnicos_info.map( tecnico => tecnico.Usuario.correo );

            const info = await transporter.sendMail({
                from: process.env.CONTACT_MAIL,
                to: cliente?.Usuario.correo,
                subject: "Actualización de pedido",
                html: progreso === 'Listo' 
                    ? htmlListo( pedido, pedido.Tecnicos ) 
                    : htmlActualizacion( tecnicos_correo, nota, progreso, pedido, pedido.Servicio )
            })

            console.log( info );

            return res.status( 200 ).json({
                status: 200,
                msg: 'Pedido actualizado',
                pedido
            });

        });

    } catch (error) {
        console.log( error )
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error: error
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