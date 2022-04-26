import Usuario from "./models/usuario";

declare global {
    namespace Express {
        export interface Request {
            usuario: Usuario;
        }
    }
}