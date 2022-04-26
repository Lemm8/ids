import { Router } from 'express';
import { deleteServicio, getServicio, getServicios, postServicio, putServicio } from "../controllers/servicio";

import { check } from "express-validator";

import { validarCampos } from '../middlewares/validar-campos';
import { existeServicio } from '../middlewares/db-validators';

import { validarJWT, isAdmin } from '../middlewares/validar-jwt';

const router = Router();

router.get( '/', getServicios );

router.get( '/:id', [
    check( 'id' ).custom( existeServicio ),
    validarCampos
], getServicio );

router.post( '/', [
    validarJWT,
    isAdmin,
    check( 'nombre', 'El nombre es obligatorio' ).exists(),
    check( 'descripcion', 'La descripción es obligatoria' ).exists(),
    validarCampos
], postServicio );

router.put( '/:id', [
    validarJWT,
    isAdmin,
    check( 'id' ).custom( existeServicio ),
    check( 'nombre', 'El nombre no puede ser nulo').optional({ nullable: true, checkFalsy: true }),
    check( 'descripcion', 'La descripción no puede ser nula' ).optional({ nullable: true, checkFalsy: true }),
    validarCampos
], putServicio );

router.patch( '/:id', [
    validarJWT,
    isAdmin,
    check( 'id' ).custom( existeServicio ),
    check( 'nombre', 'El nombre no puede ser nulo').optional({ nullable: true, checkFalsy: true }),
    check( 'descripcion', 'La descripción no puede ser nula' ).optional({ nullable: true, checkFalsy: true }),
    validarCampos
], putServicio );

router.delete( '/:id', [
    validarJWT,
    isAdmin,
    check( 'id' ).custom( existeServicio ),
    validarCampos
], deleteServicio );


export default router;
