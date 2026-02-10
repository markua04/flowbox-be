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

export { parseConversationId, parseMessageText }
