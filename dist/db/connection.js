"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
let db;
if (process.env.JAWSDB_URL) {
    db = new sequelize_1.Sequelize(process.env.JAWSDB_URL);
}
else {
    db = new sequelize_1.Sequelize(process.env.DATABASE || 'ids', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'lemm2301', {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    });
}
exports.default = db;
//# sourceMappingURL=connection.js.map