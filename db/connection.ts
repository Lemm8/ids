import { Sequelize } from 'sequelize';

// mysql://bdb6070fdf5ba3:8d6bf003@us-cdbr-east-05.cleardb.net/heroku_81a3e3fb8cdee54?reconnect=true

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
