"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInTransaction = void 0;
const db_1 = require("./db");
const runInTransaction = async (fn) => {
    await new Promise((resolve, reject) => {
        db_1.db.run("BEGIN", err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
    try {
        const result = await fn();
        await new Promise((resolve, reject) => {
            db_1.db.run("COMMIT", err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
        return result;
    }
    catch (error) {
        await new Promise((resolve, reject) => {
            db_1.db.run("ROLLBACK", err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
        throw error;
    }
};
exports.runInTransaction = runInTransaction;
