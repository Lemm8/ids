import { Sequelize } from 'sequelize';

let db: Sequelize;

if ( process.env.JAWSDB_URL ) {
    db = new Sequelize( process.env.JAWSDB_URL );
} else {
    db = new Sequelize( process.env.DATABASE!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    });
}



export default db;
