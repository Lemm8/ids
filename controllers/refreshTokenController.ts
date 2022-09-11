import { Response, Request } from 'express';

import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";

import jwt from 'jsonwebtoken';
import { generarJWT } from '../middlewares/generar-jwt';

// INTERFAZ DEL PAYLOAD
interface JwtPayload {
    id: string,
    correo: string
}


export const handleRefreshToken = async ( req: Request, res: Response ) => {

    try {        

        // BUSCAR TOKEN EN LAS COOKIES
        const cookies = req.cookies;        

        if ( !cookies?.jwt ) {
            return res.status( 401 ).json({
                error: 'No se encuentra el token en la cookies'
            })
        }

        const refreshToken = cookies.jwt; 

        // VERIFICAR JWT Y OBTENER PAYLOAD ( UID ) 
        const { id } = jwt.verify( refreshToken, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3') as JwtPayload;

        // ENCONTRAR USUARIO CON BASE A CORREO
        const usuario = await Usuario.findOne({ where: { id } });

        // MANDAR MSG SI NO HAY USUARIO
        if ( !usuario || !usuario.estado ) { 
            return res.status( 400 ).json({
                status: 400,
                msg: `No existe este usuario`
            });
        }

        let rol = '';
        let info;

        if ( await Cliente.findOne({ where: { UsuarioId: usuario.id } }) ) {
            rol = 'cliente'
            info = await Cliente.findOne({ where: { UsuarioId: usuario.id } });
        } else if ( await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: false } }) ) {
            rol = 'tecnico';
            info = await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: false } })
        } else if ( await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: true } }) ) {
            rol = 'admin';
            info = await Tecnico.findOne({ where: { UsuarioId: usuario.id, is_admin: true } });
        }

        // GENERAR TOKEN
        const token = await generarJWT( usuario.id );

        // RETORNAR USUARIO Y TOKEN
        return res.status( 200 ).json({
            status: 200,
            usuario,
            info,
            rol,
            token
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
