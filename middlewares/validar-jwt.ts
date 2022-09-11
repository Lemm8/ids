import { Response, Request, NextFunction } from 'express';
require('dotenv').config({ path: process.cwd()+'/.env' });

import Usuario from '../models/usuario';
import Cliente from '../models/cliente';
import Tecnico from '../models/tecnico';

import jwt from 'jsonwebtoken';

// INTERFAZ DEL PAYLOAD
interface JwtPayload {
    id: string,
    correo: string
}

export const validarJWT = async ( req: Request, res: Response, next: NextFunction ) => {

    try {
    
        // OBTENER TOKEN DEL HEADER
        const token = req.header('x-token');

        if ( !token ) {
            return res.status( 401 ).json({
                status: 401,
                msg: 'El token no se encuentra en la peticion'
            });
        }

        // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
        const { id } = jwt.verify( token, process.env.SECRETORPRIVATEKEY! ) as JwtPayload;

        // LEER USUARIO CORRESPONDIENTE
        const usuario = await Usuario.findOne({
            where: {
                id
            }, 
        });

        // SI USUARIO NO EXISTE
        if ( !usuario ) {
            return res.status( 401 ).json({
                msg: 'Token no válido'
            });
        }


        // VERIFICAR SI ESTADO ES FALSE
        if ( !usuario.estado ) {
            return res.status( 401 ).json({
                msg: 'Token no válido'
            });
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log( error ) ;
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


export const isCliente = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        const cliente = await Cliente.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        if ( !cliente || !cliente.Usuario.estado ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere rol de cliente'
            });
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


export const isTecnico = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        const tecnico = await Tecnico.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id, is_admin: false } });
        if ( !tecnico || !tecnico.Usuario.estado ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere rol de tecnico'
            });
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


export const isAdmin = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        
        const admin = await Tecnico.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        console.log( admin?.is_admin );
        if ( !admin || !admin.Usuario.estado || !admin.is_admin ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere el rol de administrador'
            })
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });        
    }
}



export const isTecnicoOrAdmin = async ( req: Request, res: Response, next: NextFunction ) => {
    try {  
        
        const tecnico = await Tecnico.scope("getUsuario").findOne({ where: { UsuarioId: req.usuario.id } });
        if ( !tecnico || !tecnico.Usuario.estado ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere rol de tecnico o de administrador'
            });
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


export const isUsuario = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        const usuario = await Usuario.findOne({ where: { id: req.usuario.id } });
        if ( !usuario || !usuario.estado ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere ser usuario'
            });
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


export const isClienteOrAdmin = async ( req: Request, res: Response, next: NextFunction ) => {
    try {

        // BUSCAR CLIENTE
        const cliente = await Cliente.findOne({
            where: {
                UsuarioId: req.usuario.id
            },
            include: {
                model: Usuario,
                required: true,
                where: {
                    estado: true
                }
            }
        });

        // BUSCAR ADMIN
        const admin = await Tecnico.findOne({
            where: {
                UsuarioId: req.usuario.id,
                is_admin: true
            },
            include: {
                model: Usuario,
                required: true,
                where: {
                    estado: true
                }
            }
        });

        if ( !admin && !cliente ) {
            return res.status( 403 ).json({
                status: 403,
                msg: 'Se requiere rol de cliente o de administrador'
            });
        }
        return next();

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }
}


