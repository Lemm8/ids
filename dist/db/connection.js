"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// mysql://bdb6070fdf5ba3:8d6bf003@us-cdbr-east-05.cleardb.net/heroku_81a3e3fb8cdee54?reconnect=true
let db;
if (process.env.JAWSDB_URL) {
    db = new sequelize_1.Sequelize(process.env.JAWSDB_URL);
}
else {
    db = new sequelize_1.Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    });
}
exports.default = db;
//# sourceMappingURL=connection.js.map