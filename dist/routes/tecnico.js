"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tecnico_1 = require("../controllers/tecnico");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../middlewares/db-validators");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
router.get('/', tecnico_1.getTecnicos);
router.get('/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existeTecnico),
    validar_campos_1.validarCampos
], tecnico_1.getTecnico);
router.post('/', [
    // validarJWT,
    // isAdmin,
    (0, express_validator_1.check)('correo').isEmail(),
    (0, express_validator_1.check)('correo').custom(db_validators_1.existeCorreo),
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').exists(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').exists(),
    (0, express_validator_1.check)('direccion', 'La dirección es obligatoria').exists(),
    (0, express_validator_1.check)('telefono', 'El campo "telefono" no puede ser nulo').notEmpty(),
    (0, express_validator_1.check)('telefono').custom(db_validators_1.existeTelefono),
    (0, express_validator_1.check)('curp', 'El CURP es obligatorio').exists(),
    (0, express_validator_1.check)('is_admin').optional().isBoolean(),
    (0, express_validator_1.check)('contrasena', 'El campo "contrasena" es obligatorio').exists(),
    (0, express_validator_1.check)('contrasena').custom(db_validators_1.validarContrasena),
    validar_campos_1.validarCampos
], tecnico_1.postTecnico);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isTecnicoOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeTecnico),
    (0, express_validator_1.check)('nombre').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('apellidos').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').custom(db_validators_1.validarContrasena),
    (0, express_validator_1.check)('telefono').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('direccion').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('curp').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('curp').custom(db_validators_1.existeCURP),
    (0, express_validator_1.check)('is_admin').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('is_admin').isBoolean(),
    validar_campos_1.validarCampos
], tecnico_1.putTecnico);
router.patch('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isTecnicoOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeTecnico),
    (0, express_validator_1.check)('nombre').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('apellidos').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('contrasena').custom(db_validators_1.validarContrasena),
    (0, express_validator_1.check)('telefono').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('direccion').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('curp').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('curp').custom(db_validators_1.existeCURP),
    (0, express_validator_1.check)('is_admin').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('is_admin').isBoolean(),
    validar_campos_1.validarCampos
], tecnico_1.putTecnico);
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isTecnicoOrAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeTecnico),
    validar_campos_1.validarCampos
], tecnico_1.deleteTecnico);
exports.default = router;
//# sourceMappingURL=tecnico.js.map