"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePreviewPagination = exports.parseTimelinePagination = exports.parseAttachmentInput = exports.parseMessageText = exports.parseConversationId = void 0;
const tslib_1 = require("tslib");
const httpError_1 = tslib_1.__importDefault(require("./httpError"));
const parseConversationId = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new httpError_1.default(400, "Invalid conversation id");
    }
    return parsed;
};
exports.parseConversationId = parseConversationId;
const parseMessageText = (value) => {
    if (typeof value !== "string") {
        throw new httpError_1.default(400, "Message text is required");
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        throw new httpError_1.default(400, "Message text is required");
    }
    return trimmed;
};
exports.parseMessageText = parseMessageText;
const parseAttachmentInput = (value) => {
    if (typeof value !== "object" || value === null) {
        throw new httpError_1.default(400, "Attachment payload is required");
    }
    const payload = value;
    const url = payload.url;
    const mimeType = payload.mimeType;
    const fileName = payload.fileName;
    const sizeBytes = payload.sizeBytes;
    if (typeof url !== "string" || url.trim().length === 0) {
        throw new httpError_1.default(400, "Attachment url is required");
    }
    const normalizedMimeType = typeof mimeType === "string" && mimeType.trim().length > 0 ? mimeType.trim() : undefined;
    const normalizedFileName = typeof fileName === "string" && fileName.trim().length > 0 ? fileName.trim() : undefined;
    if (sizeBytes !== undefined) {
        if (typeof sizeBytes !== "number" || !Number.isFinite(sizeBytes) || sizeBytes < 0) {
            throw new httpError_1.default(400, "Attachment sizeBytes must be a non-negative number");
        }
    }
    return {
        url: url.trim(),
        mimeType: normalizedMimeType,
        fileName: normalizedFileName,
        sizeBytes: sizeBytes
    };
};
exports.parseAttachmentInput = parseAttachmentInput;
const parseLimit = (value, defaultValue) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new httpError_1.default(400, "Limit must be a positive integer");
    }
    return parsed;
};
const parseCursor = (query) => {
    const beforeCreatedAt = query.beforeCreatedAt;
    const beforeId = query.beforeId;
    if (beforeCreatedAt === undefined && beforeId === undefined) {
        return null;
    }
    if (typeof beforeCreatedAt !== "string" || beforeCreatedAt.trim().length === 0) {
        throw new httpError_1.default(400, "beforeCreatedAt is required with beforeId");
    }
    const parsedBeforeId = Number(beforeId);
    if (!Number.isInteger(parsedBeforeId) || parsedBeforeId <= 0) {
        throw new httpError_1.default(400, "beforeId is required with beforeCreatedAt");
    }
    return {
        beforeCreatedAt: beforeCreatedAt.trim(),
        beforeId: parsedBeforeId
    };
};
const parseTimelinePagination = (query, defaultLimit = 25) => {
    const limit = parseLimit(query.limit, defaultLimit);
    return {
        limit,
        cursor: parseCursor(query)
    };
};
exports.parseTimelinePagination = parseTimelinePagination;
const parsePreviewPagination = (query, defaultLimit = 25) => {
    const limit = parseLimit(query.limit, defaultLimit);
    return {
        limit,
        cursor: parseCursor(query)
    };
};
exports.parsePreviewPagination = parsePreviewPagination;
