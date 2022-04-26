import bcrypt from "bcryptjs";

// ENCRIPTAR CONTRASEÑA  -  10 VUELTAS POR DEFECTO
export const encriptarContrasena = ( contrasena: string ) => { 
    const salt = bcrypt.genSaltSync();    
    const hash_contrasena = bcrypt.hashSync( contrasena, salt );
    return hash_contrasena;
}