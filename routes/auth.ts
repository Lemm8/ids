import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";

import { login, logout } from "../controllers/auth";

const router = Router();


// LOGIN
router.post( '/login', [
    check( 'correo' ).exists().isEmail(),
    check( 'contrasena' ).exists(),
    validarCampos
], login );

// LOGOUT
router.get( '/logout', logout );


export default router;
