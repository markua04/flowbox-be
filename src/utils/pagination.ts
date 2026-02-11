import type { ParsedQs } from "qs"
import HttpError from "./httpError"
import { normalizeQueryValue } from "./validation"

interface TimelineCursor {
	beforeCreatedAt: string
	beforeId: number
}

interface TimelinePagination {
	limit: number
	cursor: TimelineCursor | null
}

interface PreviewPagination {
	limit: number
	cursor: TimelineCursor | null
}

type QueryInput = ParsedQs | Record<string, unknown>

const DEFAULT_PAGINATION_LIMIT = 25

interface CursorClause {
	clause: string
	params: unknown[]
}

const parseLimit = (value: unknown, defaultValue: number) => {
	const normalized = normalizeQueryValue(value)
	if (normalized === undefined || normalized === null || normalized === "") {
		return defaultValue
	}
	const parsed = Number(normalized)
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new HttpError(400, "Limit must be a positive integer")
	}
	return parsed
}

const parseCursor = (query: QueryInput): TimelineCursor | null => {
	const beforeCreatedAt = normalizeQueryValue(query.beforeCreatedAt)
	const beforeId = normalizeQueryValue(query.beforeId)

	if (beforeCreatedAt === undefined && beforeId === undefined) {
		return null
	}

	if (typeof beforeCreatedAt !== "string" || beforeCreatedAt.trim().length === 0) {
		throw new HttpError(400, "beforeCreatedAt is required with beforeId")
	}

	const parsedBeforeId = Number(beforeId)
	if (!Number.isInteger(parsedBeforeId) || parsedBeforeId <= 0) {
		throw new HttpError(400, "beforeId is required with beforeCreatedAt")
	}

	return {
		beforeCreatedAt: beforeCreatedAt.trim(),
		beforeId: parsedBeforeId
	}
}

const parseTimelinePagination = (query: QueryInput, defaultLimit = DEFAULT_PAGINATION_LIMIT): TimelinePagination => {
	const limit = parseLimit(query.limit, defaultLimit)
	return {
		limit,
		cursor: parseCursor(query)
	}
}

const parsePreviewPagination = (query: QueryInput, defaultLimit = DEFAULT_PAGINATION_LIMIT): PreviewPagination => {
	const limit = parseLimit(query.limit, defaultLimit)
	return {
		limit,
		cursor: parseCursor(query)
	}
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

export { buildTimelineCursorClause, buildPreviewCursorClause, parseTimelinePagination, parsePreviewPagination, DEFAULT_PAGINATION_LIMIT }
export type { CursorClause, TimelineCursor, TimelinePagination, PreviewPagination }
