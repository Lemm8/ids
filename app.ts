import dotenv from 'dotenv';
import Server from './models/server';


// CONFIGURAR DOTENV
dotenv.config();

// INSTANCIA DE SERVIDOR
const server = new Server();

// LEVANTAR SERVIDOR
server.listen();