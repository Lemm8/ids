"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize(process.env.DATABASE || 'ids', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'lemm2301', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    //logging: false
});
exports.default = db;
//# sourceMappingURL=connection.js.map