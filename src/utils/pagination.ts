import type { TimelineCursor } from "./validation"

interface CursorClause {
	clause: string
	params: unknown[]
}

const buildCursorClause = (cursor: TimelineCursor | null, createdAtColumn: string, idColumn: string): CursorClause => {
	if (!cursor) {
		return { clause: "", params: [] }
	}

	return {
		clause: ` AND (${createdAtColumn} < ? OR (${createdAtColumn} = ? AND ${idColumn} < ?))`,
		params: [cursor.beforeCreatedAt, cursor.beforeCreatedAt, cursor.beforeId]
	}
}

const buildTimelineCursorClause = (cursor: TimelineCursor | null): CursorClause => {
	return buildCursorClause(cursor, "ci.created_at", "ci.id")
}

const buildPreviewCursorClause = (cursor: TimelineCursor | null): CursorClause => {
	return buildCursorClause(cursor, "latestItemCreatedAt", "latestItemId")
}

export { buildTimelineCursorClause, buildPreviewCursorClause }
export type { CursorClause }
