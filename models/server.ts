import express , { Application } from 'express';
import cors from 'cors';

import clientesRoutes from '../routes/cliente';
import usuariosRoutes from '../routes/usuario';
import tecnicosRoutes from '../routes/tecnico';
import serviciosRoutes from '../routes/servicio';
import pedidosRoutes from '../routes/pedido';
import authRoutes from '../routes/auth';

import db from '../db/connection';

import "../db/relations";

class Server {

    private app: Application;
    private port: string;

    private apiPaths = {
        usuarios: '/api/usuarios',
        clientes: '/api/clientes',
        tecnicos: '/api/tecnicos',
        servicios: '/api/servicios',
        pedidos: '/api/pedidos',
        auth: '/api/auth'
    };

    constructor() {

        this.app = express();
        this.port = process.env.PORT!;
        
        // CONECTAR CON LA BASE DE DATOS
        this.dbConnection();

        // DEFINIR MIDDLEWARES
        this.middlewares();

        // DEINFIR RUTAS
        this.routes();

    }


    async dbConnection() {
        try {
            
            await db.authenticate();
            //await db.sync( { alter: true, force: true } );
            console.log( 'Database online' );

        } catch ( error: any ) {
            throw new Error( error );
        }
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // LECTURA DEL BODY
        this.app.use( express.json() );

        // CARPETA PÚBLICA    
        this.app.use( express.static( 'public' ) );

    }

    routes() {
        this.app.use( this.apiPaths.usuarios, usuariosRoutes );
        this.app.use( this.apiPaths.clientes, clientesRoutes );
        this.app.use( this.apiPaths.tecnicos, tecnicosRoutes );
        this.app.use( this.apiPaths.servicios, serviciosRoutes );
        this.app.use( this.apiPaths.pedidos, pedidosRoutes );
        this.app.use( this.apiPaths.auth, authRoutes );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port);
        });
    }

}


export default Server; 
