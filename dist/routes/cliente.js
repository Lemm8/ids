"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cliente_1 = require("../controllers/cliente");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../middlewares/db-validators");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
// OBTENER TODOS LOS CLIENTES
router.get('/', cliente_1.getClientes);
// OBTENER CLIENTE
router.get('/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existeCliente),
    validar_campos_1.validarCampos
], cliente_1.getCliente);
// CREAR CLIENTE
router.post('/', [
    (0, express_validator_1.check)('correo').isEmail(),
    (0, express_validator_1.check)('correo').custom(db_validators_1.existeCorreo),
    (0, express_validator_1.check)('nombre', 'El campo "nombre" es obligatorio').exists(),
    (0, express_validator_1.check)('nombre', 'El campo "nombre" no puede ser nulo').notEmpty(),
    (0, express_validator_1.check)('apellidos', 'EL campo "apellidos" es obligatorio').exists(),
    (0, express_validator_1.check)('apellidos', 'El campo "apellidos" no puede ser nulo').notEmpty(),
    (0, express_validator_1.check)('telefono', 'El campo "telefono" es obligatorio').exists(),
    (0, express_validator_1.check)('telefono', 'El campo "telefono" no puede ser nulo').notEmpty(),
    (0, express_validator_1.check)('telefono').custom(db_validators_1.existeTelefono),
    (0, express_validator_1.check)('direccion', 'El campo "direccion es obligatorio').exists(),
    (0, express_validator_1.check)('direccion', 'El campo "direccion" no puede ser nulo').notEmpty(),
    (0, express_validator_1.check)('contrasena', 'El campo "contrasena" es obligatorio').exists(),
    (0, express_validator_1.check)('contrasena').custom(db_validators_1.validarContrasena),
    validar_campos_1.validarCampos
], cliente_1.postCliente);
// ACTUALIZAR CLIENTE
router.put('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isClienteOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeCliente),
    (0, express_validator_1.check)('nombre').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('apellidos').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('direccion').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('telefono').optional({ nullable: true, checkFalsy: true }),
    validar_campos_1.validarCampos
], cliente_1.putCliente);
router.patch('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isClienteOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeCliente),
    (0, express_validator_1.check)('nombre').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('apellidos').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('direccion').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('telefono').optional({ nullable: true, checkFalsy: true }),
    validar_campos_1.validarCampos
], cliente_1.putCliente);
// BORRAR CLIENTE ( ESTADO = FALSE )
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isClienteOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeCliente),
    validar_campos_1.validarCampos
], cliente_1.deleteCliente);
exports.default = router;
//# sourceMappingURL=cliente.js.map