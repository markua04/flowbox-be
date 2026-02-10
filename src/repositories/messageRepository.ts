import { insert } from "./db"

const createMessage = async (text: string): Promise<number> => {
	return insert("INSERT INTO messages(text) VALUES(?)", [text])
}

const createMessageChatItem = async (conversationId: number, senderType: string, senderId: number, messageId: number): Promise<number> => {
	return insert(
		"INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, message_id) VALUES(?, ?, ?, ?, ?)",
		[conversationId, "message", senderType, senderId, messageId]
	)
}

export { createMessage, createMessageChatItem }
