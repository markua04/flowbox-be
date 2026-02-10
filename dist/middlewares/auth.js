"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../repositories/db");
const error = "Please set a Authentication header by setting a header called \"authorization john@gmail.com:influencer or dream@dreaminfluencers.com:company\"";
const authMiddleware = async (req, res, next) => {
    const headers = req.headers;
    const token = headers.authorization;
    if (!token) {
        return res.status(401).json({ error });
    }
    const [email, platform] = token.split(":");
    if (!email || !platform) {
        return res.status(401).json({ error });
    }
    const platformTable = platform == "influencer" ? "influencers" : "companies";
    const sql = `SELECT id, email FROM ${platformTable} WHERE email = ?`;
    const [user] = await (0, db_1.query)(sql, [email]);
    if (!user) {
        return res.status(401).json({ error, message: "User not found" });
    }
    req.user = user;
    return next();
};
exports.default = authMiddleware;
