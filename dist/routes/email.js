"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_1 = require("../controllers/email");
const router = (0, express_1.Router)();
// ENVIAR CORREO AL CONTACTO
router.post('/contacto', email_1.sendEmailContacto);
exports.default = router;
//# sourceMappingURL=email.js.map