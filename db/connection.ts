import { Sequelize } from 'sequelize';


const db = new Sequelize( process.env.DATABASE || 'ids', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'lemm2301', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
});


export default db;
