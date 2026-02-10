"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPreviewCursorClause = exports.buildTimelineCursorClause = void 0;
const buildCursorClause = (cursor, createdAtColumn, idColumn) => {
    if (!cursor) {
        return { clause: "", params: [] };
    }
    return {
        clause: ` AND (${createdAtColumn} < ? OR (${createdAtColumn} = ? AND ${idColumn} < ?))`,
        params: [cursor.beforeCreatedAt, cursor.beforeCreatedAt, cursor.beforeId]
    };
};
const buildTimelineCursorClause = (cursor) => {
    return buildCursorClause(cursor, "ci.created_at", "ci.id");
};
exports.buildTimelineCursorClause = buildTimelineCursorClause;
const buildPreviewCursorClause = (cursor) => {
    return buildCursorClause(cursor, "latestItemCreatedAt", "latestItemId");
};
exports.buildPreviewCursorClause = buildPreviewCursorClause;
