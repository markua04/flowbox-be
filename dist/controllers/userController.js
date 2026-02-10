"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const response_1 = require("../middlewares/response");
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const userService_1 = require("../services/userService");
class UserController {
    static async me(req, res, type) {
        const userId = req.user?.id;
        if (!userId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const profile = await (0, userService_1.getUserProfile)(userId, type);
        return (0, response_1.sendSuccess)(res, profile);
    }
}
exports.default = UserController;
