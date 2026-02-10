import HttpError from "./httpError"

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

const parseConversationId = (value: string | undefined) => {
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new HttpError(400, "Invalid conversation id")
	}
	return parsed
}

const parseMessageText = (value: unknown) => {
	if (typeof value !== "string") {
		throw new HttpError(400, "Message text is required")
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new HttpError(400, "Message text is required")
	}
	return trimmed
}

const parseAttachmentInput = (value: unknown) => {
	if (typeof value !== "object" || value === null) {
		throw new HttpError(400, "Attachment payload is required")
	}

	const payload = value as Record<string, unknown>
	const url = payload.url
	const mimeType = payload.mimeType
	const fileName = payload.fileName
	const sizeBytes = payload.sizeBytes

	if (typeof url !== "string" || url.trim().length === 0) {
		throw new HttpError(400, "Attachment url is required")
	}

	const normalizedMimeType = typeof mimeType === "string" && mimeType.trim().length > 0 ? mimeType.trim() : undefined
	const normalizedFileName = typeof fileName === "string" && fileName.trim().length > 0 ? fileName.trim() : undefined

	if (sizeBytes !== undefined) {
		if (typeof sizeBytes !== "number" || !Number.isFinite(sizeBytes) || sizeBytes < 0) {
			throw new HttpError(400, "Attachment sizeBytes must be a non-negative number")
		}
	}

	return {
		url: url.trim(),
		mimeType: normalizedMimeType,
		fileName: normalizedFileName,
		sizeBytes: sizeBytes as number | undefined
	}
}

const parseLimit = (value: unknown, defaultValue: number) => {
	if (value === undefined || value === null || value === "") {
		return defaultValue
	}
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new HttpError(400, "Limit must be a positive integer")
	}
	return parsed
}

const parseCursor = (query: Record<string, unknown>): TimelineCursor | null => {
	const beforeCreatedAt = query.beforeCreatedAt
	const beforeId = query.beforeId

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

const parseTimelinePagination = (query: Record<string, unknown>, defaultLimit = 25): TimelinePagination => {
	const limit = parseLimit(query.limit, defaultLimit)
	return {
		limit,
		cursor: parseCursor(query)
	}
}

const parsePreviewPagination = (query: Record<string, unknown>, defaultLimit = 25): PreviewPagination => {
	const limit = parseLimit(query.limit, defaultLimit)
	return {
		limit,
		cursor: parseCursor(query)
	}
}

export {
	parseConversationId,
	parseMessageText,
	parseAttachmentInput,
	parseTimelinePagination,
	parsePreviewPagination
}
export type { TimelinePagination, TimelineCursor, PreviewPagination }
