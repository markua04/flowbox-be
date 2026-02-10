"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const response_1 = require("./response");
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof httpError_1.default) {
        return (0, response_1.sendError)(res, err.statusCode, {
            message: err.message,
            code: err.code,
            details: err.details
        });
    }
    console.error(err);
    return (0, response_1.sendError)(res, 500, {
        message: "Internal server error"
    });
};
exports.default = errorHandler;
