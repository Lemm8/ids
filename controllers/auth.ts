import { Response, Request } from 'express';

import bcryptjs from "bcryptjs";

import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";

import jwt from 'jsonwebtoken';

import { generarJWT, generarRefreshJWT } from '../middlewares/generar-jwt';

// INTERFAZ DEL PAYLOAD
interface JwtPayload {
    id: string,
    correo: string
}

export const login = async ( req: Request, res: Response ) => {

    // DATOS DE ENTRADA DEL LOGIN
    const { correo, contrasena } = req.body;

    try {        

        // ENCONTRAR USUARIO CON BASE A CORREO
        const usuario = await Usuario.findOne({ where: { correo } });

        // MANDAR MSG SI NO HAY USUARIO
        if ( !usuario || !usuario.estado ) { 
            return res.status( 400 ).json({
                status: 400,
                msg: `No existe un usuario con este correo: ${ correo }`
            });
        }

        // VALIDAR CONTRASENA
        const validar = bcryptjs.compareSync( contrasena, usuario.contrasena );
        if ( !validar ) {
            return res.status( 400 ).json({
                status: 400,
                msg: 'La contraseña es incorrecta'
            });
        }

        let rol = ''

        if ( await Cliente.findOne({ where: { UsuarioId: usuario.id } }) ) {
            rol = 'cliente'
        } else if ( await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: false } }) ) {
            rol = 'tecnico'
        } else if ( await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: true } }) ) {
            rol = 'admin'
        }

        // GENERAR TOKEN DE ACCESO Y REFRESH
        const accessToken = await generarJWT( usuario.id );
        const refreshToken = await generarRefreshJWT( usuario.id );

        // GUARDAR REFRESH TOKEN COMO HTTP ONLY PARA NO SER LEIDA EN JS
        res.cookie( 'jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 72 * 60 * 60 * 1000 } );

        // RETORNAR USUARIO Y TOKEN
        return res.status( 200 ).json({
            status: 200,
            usuario,
            rol,
            token: accessToken
        })

    } catch (error) {
        console.log( error );
        return res.status( 500 ).json({
            status: 500,
            msg: 'Error en el servidor',
            error
        });
    }

}

export const logout = async ( req: Request, res: Response ) => {

    // BORRAR TOKEN

    // BUSCAR TOKEN EN LAS COOKIES
    const cookies = req.cookies;
    if ( !cookies?.jwt ) {
        return res.status( 204 ).json({
            error: 'No se encuentra el token en la cookies'
        })
    }
    const refreshToken = cookies.jwt;

    // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
    const { id } = jwt.verify( refreshToken, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3') as JwtPayload;

    // ENCONTRAR USUARIO CON BASE A CORREO
    const usuario = await Usuario.findOne({ where: { id } });

    // BORRAR COOKIE 
    if ( !usuario || !usuario.estado ) { 
        res.clearCookie( 'jwt', { httpOnly: true, secure: true, sameSite: 'none' } );
        return res.status( 204 );
    }

    res.clearCookie( 'jwt', { httpOnly: true } );
    return res.sendStatus( 204 );

}
