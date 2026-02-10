"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const tslib_1 = require("tslib");
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const userRepository_1 = require("../repositories/userRepository");
const getUserProfile = async (id, type) => {
    const user = type === "company" ? await (0, userRepository_1.getCompanyById)(id) : await (0, userRepository_1.getInfluencerById)(id);
    if (!user) {
        throw new httpError_1.default(404, "User not found");
    }
    return user;
};
exports.getUserProfile = getUserProfile;
