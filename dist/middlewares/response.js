"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, meta) => {
    return res.json({
        success: true,
        data,
        meta: meta ?? null
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, error) => {
    return res.status(statusCode).json({
        success: false,
        error
    });
};
exports.sendError = sendError;
