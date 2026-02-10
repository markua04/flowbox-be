"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNextCursorFromPreview = exports.buildNextCursorFromTimeline = void 0;
const buildNextCursorFromTimeline = (rows, limit) => {
    if (rows.length !== limit) {
        return null;
    }
    const last = rows[rows.length - 1];
    return {
        beforeCreatedAt: last.itemCreatedAt,
        beforeId: last.itemId
    };
};
exports.buildNextCursorFromTimeline = buildNextCursorFromTimeline;
const buildNextCursorFromPreview = (rows, limit) => {
    if (rows.length !== limit) {
        return null;
    }
    const last = rows[rows.length - 1];
    if (!last.latestItemCreatedAt || !last.latestItemId) {
        return null;
    }
    return {
        beforeCreatedAt: last.latestItemCreatedAt,
        beforeId: last.latestItemId
    };
};
exports.buildNextCursorFromPreview = buildNextCursorFromPreview;
