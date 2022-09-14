import { Sequelize } from 'sequelize';
require('dotenv').config({ path: process.cwd()+'/.env' });

let db: Sequelize;

if ( process.env.JAWSDB_URL ) {
    db = new Sequelize( process.env.JAWSDB_URL );
} else {
    db = new Sequelize( process.env.MYSQLDATABASE!, process.env.MYSQLUSER!, process.env.MYSQLPASSWORD!, {
        host: process.env.MYSQLHOST!,
        dialect: 'mysql',
        port: parseInt(process.env.MYSQLPORT!),
        logging: false
    });
}



export default db;