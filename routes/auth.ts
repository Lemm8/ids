import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";
import { validarContrasena } from "../middlewares/db-validators";

import { login } from "../controllers/auth";

const router = Router();


// LOGIN
router.post( '/login', [
    check( 'correo' ).exists().isEmail(),
    check( 'contrasena' ).exists(),
    validarCampos
], login );



export default router;
