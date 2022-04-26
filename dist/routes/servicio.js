"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicio_1 = require("../controllers/servicio");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../middlewares/db-validators");
const validar_jwt_1 = require("../middlewares/validar-jwt");
const router = (0, express_1.Router)();
router.get('/', servicio_1.getServicios);
router.get('/:id', [
    (0, express_validator_1.check)('id').custom(db_validators_1.existeServicio),
    validar_campos_1.validarCampos
], servicio_1.getServicio);
router.post('/', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isAdmin,
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').exists(),
    (0, express_validator_1.check)('descripcion', 'La descripción es obligatoria').exists(),
    validar_campos_1.validarCampos
], servicio_1.postServicio);
router.put('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeServicio),
    (0, express_validator_1.check)('nombre', 'El nombre no puede ser nulo').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('descripcion', 'La descripción no puede ser nula').optional({ nullable: true, checkFalsy: true }),
    validar_campos_1.validarCampos
], servicio_1.putServicio);
router.patch('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeServicio),
    (0, express_validator_1.check)('nombre', 'El nombre no puede ser nulo').optional({ nullable: true, checkFalsy: true }),
    (0, express_validator_1.check)('descripcion', 'La descripción no puede ser nula').optional({ nullable: true, checkFalsy: true }),
    validar_campos_1.validarCampos
], servicio_1.putServicio);
router.delete('/:id', [
    validar_jwt_1.validarJWT,
    validar_jwt_1.isAdmin,
    (0, express_validator_1.check)('id').custom(db_validators_1.existeServicio),
    validar_campos_1.validarCampos
], servicio_1.deleteServicio);
exports.default = router;
//# sourceMappingURL=servicio.js.map