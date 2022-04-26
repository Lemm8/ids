import jwt from 'jsonwebtoken';

// GENERAR JSON WEB TOKEN
export const generarJWT = async ( id: number ) => {

    // RETORNAR PROMESA 
    return new Promise( ( resolve: any, reject: any ) => {
     
        const payload = { id };

        // GENERAR TOKEN CON EL PAYLOAD Y PRIVATEKEY
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY || 'EoHmk179LD0@K90jmGe3', {
            expiresIn: '20d'
        }, ( err, token ) => {
            if ( err ) {
                reject( 'No se pudo generar el token' );
            } else {
                resolve( token );
            }
        });

    })

}