"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_1 = tslib_1.__importDefault(require("../../decorators/user"));
const messages_1 = tslib_1.__importDefault(require("./messages"));
router.use("/messages", messages_1.default);
router.get("/", async (req, res) => {
    res.json({
        message: "Influencer Platform!"
    });
});
exports.default = (0, user_1.default)(router, "influencer");
