import type { ConversationPreviewRow, ConversationTimelineRow } from "../repositories/conversationRepository"
import type { TimelineCursor } from "../utils/pagination"

const buildNextCursorFromTimeline = (rows: ConversationTimelineRow[], limit: number): TimelineCursor | null => {
	if (rows.length !== limit) {
		return null
	}

	const last = rows[rows.length - 1]
	return {
		beforeCreatedAt: last.itemCreatedAt,
		beforeId: last.itemId
	}
}

const buildNextCursorFromPreview = (rows: ConversationPreviewRow[], limit: number): TimelineCursor | null => {
	if (rows.length !== limit) {
		return null
	}

	const last = rows[rows.length - 1]
	if (!last.latestItemCreatedAt || !last.latestItemId) {
		return null
	}

	return {
		beforeCreatedAt: last.latestItemCreatedAt,
		beforeId: last.latestItemId
	}
}

export { buildNextCursorFromTimeline, buildNextCursorFromPreview }
