"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
};
exports.default = corsOptions;
//# sourceMappingURL=corsOptions.js.map