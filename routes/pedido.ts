import { Router } from "express";
import { getPedidos, getPedido, postPedido, putPedido, deletePedido } from "../controllers/pedido";

import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { existeCliente, existenTecnicos, existeServicio, existePedido, existeTecnico } from '../middlewares/db-validators';

import { validarJWT, isAdmin, isCliente, isUsuario, isClienteOrAdmin } from '../middlewares/validar-jwt';

const router = Router();

router.get( '/', [
    validarJWT,
], getPedidos );

router.get( '/:id', [
    validarJWT,
    check( 'id' ).custom( existePedido ),
    validarCampos
], getPedido );

router.post( '/', [
    validarJWT,
    isCliente,
    check( 'titulo', 'El titulo es obligatorio' ).exists(),
    check( 'descripcion', 'La descripción es obligatoria' ).exists(),
    check( 'costo', 'El costo es obligatorio' ).exists(),
    check( 'costo', 'El costo debe ser numérico' ).isNumeric(),
    check( 'lugar_entrega').optional({ nullable: true, checkFalsy: true }),
    check( 'cliente', 'El cliente es obligatorio' ).exists(),
    check( 'cliente' ).custom( existeCliente ),
    check( 'servicio', 'El servicio es obligatorio' ).exists(),
    check( 'servicio' ).custom( existeServicio ),
    check( 'tecnicos', 'Los tecnicos son obligatorios' ).exists(),
    check( 'tecnicos' ).isArray(),
    check( 'tecnicos.*' ).custom( existeTecnico ),
    validarCampos
], postPedido );

router.put( '/:id', [
    validarJWT,
    isUsuario,
    check( 'id' ).custom( existePedido ),
    check( 'titulo', 'El titulo es obligatorio' ).exists(),
    check( 'descripcion', 'La descripción es obligatoria' ).exists(),
    check( 'costo', 'El costo es obligatorio' ).exists(),
    check( 'costo', 'El costo debe ser numérico' ).isNumeric().optional({ nullable: true, checkFalsy: true }),
    check( 'lugar_entrega').optional({ nullable: true, checkFalsy: true }),
    validarCampos
], putPedido )

router.delete( '/:id', [
    validarJWT,
    isClienteOrAdmin,
    check( 'id' ).custom( existePedido ),
    validarCampos
], deletePedido );



export default router;
