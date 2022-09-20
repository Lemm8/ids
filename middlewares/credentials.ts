import allowedOrigins from '../config/allowedOrigins';
import { Request, Response, NextFunction } from 'express';

const credentials = ( req: Request, res: Response, next: NextFunction ) => {
    const origin = req.headers.origin;
    if ( origin && allowedOrigins.includes( origin ) ) {
        res.setHeader( 'Access-Control-Allow-Credentials', 'true' );
        res.setHeader( 'Access-Control-Allow-Origin', origin );
    }
    next();
}

export default credentials;