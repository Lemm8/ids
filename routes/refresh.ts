import { Router } from "express";

import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = Router();


// REFRESH TOKEN
router.get( '/', handleRefreshToken );



export default router;
