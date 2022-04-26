import { Response, Request } from 'express';

import bcryptjs from "bcryptjs";

import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Tecnico from "../models/tecnico";

import { generarJWT } from '../middlewares/generar-jwt';

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

        // GENERAR TOKEN
        const token = await generarJWT( usuario.id );

        // RETORNAR USUARIO Y TOKEN
        return res.status( 200 ).json({
            status: 200,
            usuario,
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
