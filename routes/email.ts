import { Router } from "express";
import { sendEmailContacto } from "../controllers/email";

const router = Router();

// ENVIAR CORREO AL CONTACTO
router.post( '/contacto', sendEmailContacto );

export default router;
