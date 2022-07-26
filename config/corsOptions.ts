import allowedOrigins from "./allowedOrigins";

const corsOptions = {
    // origin: '*',
    origin: ( origin: any, callback: any ) => {
        if ( allowedOrigins.indexOf( origin ) !== -1 || !origin ) {
            callback( null, true )
        } else {
            callback( new Error( 'Not allowed by cors' ) )
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
}

export default corsOptions;