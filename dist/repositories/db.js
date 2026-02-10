"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.insert = exports.execute = exports.db = void 0;
const tslib_1 = require("tslib");
const sqlite3_1 = tslib_1.__importDefault(require("sqlite3"));
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const dbPath = process.env.DB_PATH ?? "./database/main.db";
const db = new sqlite3_1.default.Database(dbPath);
exports.db = db;
const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) {
            return reject(new httpError_1.default(500, "Database query failed", "DB_QUERY_ERROR"));
        }
        resolve(rows);
    });
});
exports.query = query;
const execute = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, err => {
        if (err) {
            return reject(new httpError_1.default(500, "Database execution failed", "DB_EXECUTE_ERROR"));
        }
        resolve();
    });
});
exports.execute = execute;
const insert = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
        if (err) {
            return reject(new httpError_1.default(500, "Database insert failed", "DB_INSERT_ERROR"));
        }
        resolve(this.lastID ?? 0);
    });
});
exports.insert = insert;
