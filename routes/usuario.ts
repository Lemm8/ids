import { Router } from "express";
import { getUsuario } from "../controllers/usuario";


const router = Router();


router.get( '/',        getUsuario );


export default router;