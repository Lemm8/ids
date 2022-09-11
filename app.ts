import Server from './models/server';
require('dotenv').config({ path: process.cwd()+'/.env' });

// INSTANCIA DE SERVIDOR
const server = new Server();

// LEVANTAR SERVIDOR
server.listen();