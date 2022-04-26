"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../middlewares/db-validators");
const auth_1 = require("../controllers/auth");
const router = (0, express_1.Router)();
// LOGIN
router.post('/login', [
    (0, express_validator_1.check)('correo').exists().isEmail(),
    (0, express_validator_1.check)('contrasena').exists().custom(db_validators_1.validarContrasena),
    validar_campos_1.validarCampos
], auth_1.login);
exports.default = router;
//# sourceMappingURL=auth.js.map