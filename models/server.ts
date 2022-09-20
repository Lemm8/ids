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
        // CORS
        this.app.use( cors( {
            origin: ( origin, callback ) => {
                if ( allowedOrigins.indexOf( origin! ) !== -1 ) {
                    callback( null, true );
                } else {
                    callback( new Error( `${origin} not allowed` ) )
                }
            },
            methods: [ "GET", "POST", "PUT", "PATCH", "DELETE" ],
            allowedHeaders: ["Access-Control-Allow-Origin", "Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
            optionsSuccessStatus: 200,
            credentials: true
        }));
        
        this.app.use( function (req, res, next) {
            const origin = req.headers.origin;
            if ( origin && allowedOrigins.includes( origin ) ) {
                res.header( 'Access-Control-Allow-Credentials', 'true' );
                res.header( 'Access-Control-Allow-Origin', origin );
            }
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        });

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
