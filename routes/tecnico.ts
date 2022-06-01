import { Router } from "express";
import { deleteTecnico, getTecnico, getTecnicos, postTecnico, putTecnico } from "../controllers/tecnico";

import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { validarContrasena, existeCorreo, existeTecnico, existeTelefono, existeCURP } from '../middlewares/db-validators';

import { validarJWT, isTecnicoOrAdmin, isAdmin } from '../middlewares/validar-jwt';


const router = Router();

router.get( '/', getTecnicos );

router.get( '/:id', [
    check( 'id' ).custom( existeTecnico ),
    validarCampos
], getTecnico );

router.post( '/', [
    validarJWT,
    isAdmin,
    check( 'correo' ).isEmail(),
    check( 'correo' ).custom( existeCorreo ),
    check( 'nombre', 'El nombre es obligatorio' ).exists(),
    check( 'apellidos', 'Los apellidos son obligatorios' ).exists(),
    check( 'direccion', 'La dirección es obligatoria' ).exists(),
    check( 'telefono', 'El campo "telefono" no puede ser nulo' ).notEmpty(),
    check( 'telefono' ).custom( existeTelefono ),
    check( 'curp', 'El CURP es obligatorio' ).exists(),
    check( 'is_admin' ).optional().isBoolean(),
    check( 'contrasena', 'El campo "contrasena" es obligatorio' ).exists(),
    check( 'contrasena' ).custom( validarContrasena ),
    validarCampos
], postTecnico );


router.put( '/:id', [
    validarJWT,
    isTecnicoOrAdmin,
    check( 'id' ).custom( existeTecnico ),
    check( 'nombre' ).optional({ nullable: true, checkFalsy: true }),
    check( 'apellidos' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).custom( validarContrasena ),
    check( 'telefono' ).optional({ nullable: true, checkFalsy: true }),
    check( 'direccion' ).optional({ nullable: true, checkFalsy: true }),
    check( 'curp' ).optional({ nullable: true, checkFalsy: true }),
    check( 'curp' ).custom( existeCURP ),
    check( 'is_admin' ).optional({ nullable: true, checkFalsy: true }),
    check( 'is_admin' ).isBoolean(),
    validarCampos
], putTecnico )

router.patch( '/:id', [
    validarJWT,
    isTecnicoOrAdmin,
    check( 'id' ).custom( existeTecnico ),
    check( 'nombre' ).optional({ nullable: true, checkFalsy: true }),
    check( 'apellidos' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).custom( validarContrasena ),
    check( 'telefono' ).optional({ nullable: true, checkFalsy: true }),
    check( 'direccion' ).optional({ nullable: true, checkFalsy: true }),
    check( 'curp' ).optional({ nullable: true, checkFalsy: true }),
    check( 'curp' ).custom( existeCURP ),
    check( 'is_admin' ).optional({ nullable: true, checkFalsy: true }),
    check( 'is_admin' ).isBoolean(),
    validarCampos
], putTecnico )

router.delete( '/:id', [
    validarJWT,
    isTecnicoOrAdmin,
    check( 'id' ).custom( existeTecnico ),
    validarCampos
],deleteTecnico )


export default router;