import allowedOrigins from "../config/allowedOrigins";
import { Request, Response, NextFunction } from "express";

const corsOptions = {
    origin: ( origin: any, callback: any ) => {
        if ( allowedOrigins.indexOf( origin! ) !== -1 || !origin ) {
            console.log( origin );
            callback( null, true );
        } else {
            callback( new Error( `${origin} not allowed` ) )
        }
    },
    methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
    allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 200,
    credentials: true
}

export default corsOptions;