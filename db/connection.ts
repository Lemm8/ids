import { Sequelize } from 'sequelize';
require('dotenv').config({ path: process.cwd()+'/.env' });

let db: Sequelize;

if ( process.env.JAWSDB_URL ) {
    db = new Sequelize( process.env.JAWSDB_URL );
} else {
    db = new Sequelize( process.env.DATABASE!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
        host: process.env.DB_HOST!,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT!),
        logging: false
    });
}



export default db;