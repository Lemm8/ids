"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedido_1 = require("../controllers/pedido");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../middlewares/db-validators");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
router.get('/', [], pedido_1.getPedidos);
router.get('/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existePedido),
    validar_campos_1.validarCampos
], pedido_1.getPedido);
router.get('/cliente/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeCliente),
], pedido_1.getPedidosCliente);
router.get('/tecnico/:id', [
    validar_jwt_1.validarJWT,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeTecnico),
], pedido_1.getPedidosTecnico);
router.post('/', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isCliente,
    (0, express_validator_1.check)('titulo', 'El titulo es obligatorio').exists(),
    (0, express_validator_1.check)('descripcion', 'La descripción es obligatoria').exists(),
    (0, express_validator_1.check)('costo', 'El costo es obligatorio').exists(),
    (0, express_validator_1.check)('costo', 'El costo debe ser numérico').isNumeric(),
    (0, express_validator_1.check)('lugar_entrega').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('cliente', 'El cliente es obligatorio').exists(),
    (0, express_validator_1.check)('cliente').custom(db_validators_1.existeCliente),
    (0, express_validator_1.check)('servicio', 'El servicio es obligatorio').exists(),
    (0, express_validator_1.check)('servicio').custom(db_validators_1.existeServicio),
    validar_campos_1.validarCampos
], pedido_1.postPedido);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isUsuario,
    (0, express_validator_1.check)('id').custom(db_validators_1.existePedido),
    (0, express_validator_1.check)('costo', 'El costo es obligatorio').exists(),
    (0, express_validator_1.check)('costo', 'El costo debe ser numérico').isNumeric().optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('lugar_entrega').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('tecnicos').isArray(),
    (0, express_validator_1.check)('tecnicos.*').custom(db_validators_1.existeTecnico),
    validar_campos_1.validarCampos
], pedido_1.putPedido);
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isClienteOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existePedido),
    validar_campos_1.validarCampos
], pedido_1.deletePedido);
exports.default = router;
//# sourceMappingURL=pedido.js.map