import { Router } from "express";
import { deleteCliente, getCliente, getClientes, postCliente, putCliente } from "../controllers/cliente";

import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { validarContrasena, existeCorreo, existeCliente, existeTelefono } from '../middlewares/db-validators';

import { validarJWT, isClienteOrAdmin } from '../middlewares/validar-jwt';

const router = Router();

// OBTENER TODOS LOS CLIENTES
router.get( '/', getClientes );

// OBTENER CLIENTE
router.get( '/:id', [
    check( 'id' ).custom( existeCliente ),
    validarCampos
], getCliente );

// CREAR CLIENTE
router.post( '/', [
    check( 'correo' ).isEmail(),
    check( 'correo' ).custom( existeCorreo ),
    check( 'nombre', 'El campo "nombre" es obligatorio' ).exists(),
    check( 'nombre', 'El campo "nombre" no puede ser nulo' ).notEmpty(),
    check( 'apellidos', 'EL campo "apellidos" es obligatorio' ).exists(),
    check( 'apellidos', 'El campo "apellidos" no puede ser nulo' ).notEmpty(),
    check( 'telefono', 'El campo "telefono" es obligatorio' ).exists(),
    check( 'telefono', 'El campo "telefono" no puede ser nulo' ).notEmpty(),
    check( 'telefono' ).custom( existeTelefono ),
    check( 'direccion', 'El campo "direccion es obligatorio' ).exists(),
    check( 'direccion', 'El campo "direccion" no puede ser nulo' ).notEmpty(),
    check( 'contrasena', 'El campo "contrasena" es obligatorio' ).exists(),
    check( 'contrasena' ).custom( validarContrasena ),
    validarCampos
], postCliente );

// ACTUALIZAR CLIENTE
router.put( '/:id', [
    validarJWT,
    isClienteOrAdmin,
    check( 'id' ).custom( existeCliente ),
    check( 'nombre' ).optional({ nullable: true, checkFalsy: true }),
    check( 'apellidos' ).optional({ nullable: true, checkFalsy: true }),
    check( 'direccion' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).optional({ nullable: true, checkFalsy: true }),
    check( 'telefono' ).optional({ nullable: true, checkFalsy: true }),
    validarCampos
], putCliente );

router.patch( '/:id', [
    validarJWT,
    isClienteOrAdmin,
    check( 'id' ).custom( existeCliente ),
    check( 'nombre' ).optional({ nullable: true, checkFalsy: true }),
    check( 'apellidos' ).optional({ nullable: true, checkFalsy: true }),
    check( 'direccion' ).optional({ nullable: true, checkFalsy: true }),
    check( 'contrasena' ).optional({ nullable: true, checkFalsy: true }),
    check( 'telefono' ).optional({ nullable: true, checkFalsy: true }),
    validarCampos
], putCliente );

// BORRAR CLIENTE ( ESTADO = FALSE )
router.delete( '/:id', [
    validarJWT,
    isClienteOrAdmin,
    check( 'id' ).custom( existeCliente ),
    validarCampos
], deleteCliente );


export default router;