"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require('dotenv').config({ path: process.cwd() + '/.env' });
let db;
if (process.env.JAWSDB_URL) {
    db = new sequelize_1.Sequelize(process.env.JAWSDB_URL);
}
else {
    db = new sequelize_1.Sequelize(process.env.DATABASE, process.env.DBUSER, process.env.DBPASSWORD, {
        host: process.env.DBHOST,
        dialect: 'postgres',
        port: parseInt(process.env.DBPORT),
        logging: false
    });
}
exports.default = db;
//# sourceMappingURL=connection.js.map