import { Request, Response } from "express"
import Usuario from "../models/usuario";

export const getUsuario = async ( req: Request, res: Response ) => {

    const usuarios = await Usuario.findAll();

    res.json({
        usuarios
    });

}

export const getUsuarioById = async ( req: Request, res: Response ) => {

    const { id } = req.params

    const usuario = await Usuario.findByPk( id );

    res.json({
        usuario
    });

}

export const postUsuario = async ( req: Request, res: Response ) => {

    const { correo, contrasena, telefono } = req.body;

    const usuario = await Usuario.create( { correo, telefono, contrasena } );

    res.json({
        msg: 'Get Usuarios',
        usuario,
    });

}

