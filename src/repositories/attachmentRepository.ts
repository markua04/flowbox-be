import { insert } from "./db"

interface AttachmentInput {
	url: string
	mimeType?: string
	fileName?: string
	sizeBytes?: number
}

const createAttachment = async (input: AttachmentInput): Promise<number> => {
	return insert(
		"INSERT INTO attachments(url, mime_type, file_name, size_bytes) VALUES(?, ?, ?, ?)",
		[input.url, input.mimeType ?? null, input.fileName ?? null, input.sizeBytes ?? null]
	)
}

const createAttachmentChatItem = async (conversationId: number, senderType: string, senderId: number, attachmentId: number): Promise<number> => {
	return insert(
		"INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, attachment_id) VALUES(?, ?, ?, ?, ?)",
		[conversationId, "attachment", senderType, senderId, attachmentId]
	)
}

export { createAttachment, createAttachmentChatItem }
export type { AttachmentInput }
