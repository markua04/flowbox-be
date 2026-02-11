import HttpError from "./httpError"

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

const normalizeQueryValue = (value: unknown) => (Array.isArray(value) ? value[0] : value)

export {
	parseConversationId,
	parseMessageText,
	parseAttachmentInput
}
export { normalizeQueryValue }
