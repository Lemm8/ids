import express , { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import clientesRoutes from '../routes/cliente';
import usuariosRoutes from '../routes/usuario';
import tecnicosRoutes from '../routes/tecnico';
import serviciosRoutes from '../routes/servicio';
import pedidosRoutes from '../routes/pedido';
import authRoutes from '../routes/auth';
import refreshRoutes from '../routes/refresh';
import emailRoutes from '../routes/email';

import db from '../db/connection';

import "../db/relations";
import credentials from '../middlewares/credentials';
import allowedOrigins from '../config/allowedOrigins';
import corsOptions from '../middlewares/corsOptions';

class Server {

    private app: Application;
    private port: string;

    private apiPaths = {
        usuarios: '/api/usuarios',
        clientes: '/api/clientes',
        tecnicos: '/api/tecnicos',
        servicios: '/api/servicios',
        pedidos: '/api/pedidos',
        auth: '/api/auth',
        refresh: '/api/refresh',
        email: '/api/email',
    };

    constructor() {
        this.app = express();
        this.port = process.env.PORT!;
        // this.port = process.env.PORT || '3301';
        
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
            console.log( 'Database online' );

        } catch ( error: any ) {
            throw new Error( error );
        }
    }


    middlewares() {
        // HANLDE OPTIONS CREDENTIALS BEFORE CORS
        this.app.use( credentials );

        // CORS
        // this.app.options( '*', cors( corsOptions ) );
        this.app.use( cors( corsOptions )); 

        // LECTURA DEL BODY
        this.app.use( express.json() );
        
        // COOKIE PARSER
        this.app.use( cookieParser() );

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
        this.app.use( this.apiPaths.refresh, refreshRoutes );
        this.app.use( this.apiPaths.email, emailRoutes );
    }


    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto ' + this.port);
        });
    }

}


export default Server; 
