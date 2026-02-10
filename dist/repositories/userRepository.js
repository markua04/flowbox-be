"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfluencerById = exports.getCompanyById = void 0;
const db_1 = require("./db");
const getCompanyById = async (id) => {
    const [row] = await (0, db_1.query)("SELECT id, email, name FROM companies WHERE id = ?", [id]);
    return row ?? null;
};
exports.getCompanyById = getCompanyById;
const getInfluencerById = async (id) => {
    const [row] = await (0, db_1.query)("SELECT id, email, name FROM influencers WHERE id = ?", [id]);
    return row ?? null;
};
exports.getInfluencerById = getInfluencerById;
