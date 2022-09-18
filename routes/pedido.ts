import { Router } from "express";
import { getPedidos, getPedidosCliente, getPedidosTecnico, getPedido, postPedido, putPedido, deletePedido } from "../controllers/pedido";

import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { existeCliente, existenTecnicos, existeServicio, existePedido, existeTecnico } from '../middlewares/db-validators';

import { validarJWT, isAdmin, isCliente, isUsuario, isClienteOrAdmin } from '../middlewares/validar-jwt';

const router = Router();

router.get( '/', [
], getPedidos );

router.get( '/:id', [
    check( 'id' ).custom( existePedido ),
    validarCampos
], getPedido );

router.get( '/cliente/:id', [
    validarJWT,
    check( 'id' ).custom( existeCliente ),
], getPedidosCliente);

router.get( '/tecnico/:id', [
    validarJWT,
    check( 'id' ).custom( existeTecnico ),
], getPedidosTecnico);

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
    validarCampos
], postPedido );

router.put( '/:id', [
    validarJWT,
    isUsuario,
    check( 'id' ).custom( existePedido ),
    check( 'costo', 'El costo es obligatorio' ).exists(),
    check( 'costo', 'El costo debe ser numérico' ).isNumeric().optional({ nullable: true, checkFalsy: true }),
    check( 'lugar_entrega').optional({ nullable: true, checkFalsy: true }),
    check( 'tecnicos' ).isArray(),
    check( 'tecnicos.*' ).custom( existeTecnico ),
    validarCampos
], putPedido )

router.delete( '/:id', [
    validarJWT,
    isClienteOrAdmin,
    check( 'id' ).custom( existePedido ),
    validarCampos
], deletePedido );



export default router;
