"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const auth_1 = tslib_1.__importDefault(require("../middlewares/auth"));
const userController_1 = tslib_1.__importDefault(require("../controllers/userController"));
const asyncHandler_1 = tslib_1.__importDefault(require("../middlewares/asyncHandler"));
exports.default = (router, type) => {
    router.get("/me", auth_1.default, (0, asyncHandler_1.default)((req, res) => {
        return userController_1.default.me(req, res, type);
    }));
    return router;
};
