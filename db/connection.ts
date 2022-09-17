import { Sequelize } from 'sequelize';
require('dotenv').config({ path: process.cwd()+'/.env' });

let db: Sequelize;

if ( process.env.JAWSDB_URL ) {
    db = new Sequelize( process.env.JAWSDB_URL );
} else {
    db = new Sequelize( process.env.DATABASE!, process.env.DBUSER!, process.env.DBPASSWORD!, {
        host: process.env.DBHOST!,
        dialect: 'postgres',
        port: parseInt(process.env.DBPORT!),
        logging: false
    });
}

export default db;