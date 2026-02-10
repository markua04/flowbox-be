"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const schemaRepository_1 = require("../repositories/schemaRepository");
const seedRepository_1 = require("../seeds/seedRepository");
const initializeDatabase = async () => {
    await (0, schemaRepository_1.createSchema)();
    await (0, seedRepository_1.seedData)();
};
exports.initializeDatabase = initializeDatabase;
