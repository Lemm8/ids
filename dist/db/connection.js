"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require('dotenv').config({ path: process.cwd() + '/.env' });
let db;
if (process.env.JAWSDB_URL) {
    db = new sequelize_1.Sequelize(process.env.JAWSDB_URL);
}
else {
    db = new sequelize_1.Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT),
        logging: false
    });
}
exports.default = db;
//# sourceMappingURL=connection.js.map