import allowedOrigins from "../config/allowedOrigins";



const corsOptions = {
    // origin: ( origin: any, callback: any ) => {
    //     if ( allowedOrigins.indexOf( origin! ) !== -1 || !origin ) {
    //         callback( null, true ); 
    //     } else {
    //         callback( new Error( `${origin} not allowed` ) )
    //     }
    // },
    origin: ["http://idslapaz.com", "https://idslapaz.com", "http://localhost:3000"],
    optionsSuccessStatus: 200,
}

export default corsOptions;