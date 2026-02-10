import {
	ConversationPreviewRow,
	ConversationRow,
	ConversationTimelineRow,
	getCompanyConversationById,
	getCompanyConversationPreviews,
	getConversationTimeline,
	getInfluencerConversationById,
	getInfluencerConversationPreviews
} from "../repositories/conversationRepository"
import { createMessage, createMessageChatItem, getChatItemById } from "../repositories/messageRepository"
import HttpError from "../utils/httpError"

interface ConversationCounterpart {
	id: number
	name: string
	email: string
	handle: string | null
}

interface ChatItemPreview {
	id: number | null
	type: string | null
	senderType: string | null
	senderId: number | null
	createdAt: string | null
	payload: Record<string, unknown> | null
}

interface ConversationPreview {
	conversationId: number
	companyId: number
	influencerId: number
	counterpart: ConversationCounterpart
	latestItem: ChatItemPreview
}

interface ChatItem {
	id: number
	type: string
	senderType: string
	senderId: number
	createdAt: string
	payload: Record<string, unknown> | null
}

interface ConversationDetail {
	conversationId: number
	companyId: number
	influencerId: number
	counterpart: ConversationCounterpart
	items: ChatItem[]
}

const buildPreviewPayload = (row: ConversationPreviewRow): Record<string, unknown> | null => {
	switch (row.latestItemType) {
		case "message":
			return {
				text: row.messageText
			}
		case "attachment":
			return {
				url: row.attachmentUrl,
				mimeType: row.attachmentMimeType,
				fileName: row.attachmentFileName,
				sizeBytes: row.attachmentSizeBytes
			}
		case "post":
			return {
				platform: row.postPlatform,
				url: row.postUrl,
				title: row.postTitle,
				caption: row.postCaption
			}
		case "transfer":
			return {
				amount: row.transferAmount,
				currency: row.transferCurrency,
				state: row.transferState,
				reference: row.transferReference
			}
		default:
			return null
	}
}

const mapPreview = (row: ConversationPreviewRow): ConversationPreview => ({
	conversationId: row.conversationId,
	companyId: row.companyId,
	influencerId: row.influencerId,
	counterpart: {
		id: row.counterpartId,
		name: row.counterpartName,
		email: row.counterpartEmail,
		handle: row.counterpartHandle
	},
	latestItem: {
		id: row.latestItemId,
		type: row.latestItemType,
		senderType: row.latestItemSenderType,
		senderId: row.latestItemSenderId,
		createdAt: row.latestItemCreatedAt,
		payload: buildPreviewPayload(row)
	}
})

const buildTimelinePayload = (row: ConversationTimelineRow): Record<string, unknown> | null => {
	switch (row.itemType) {
		case "message":
			return {
				text: row.messageText
			}
		case "attachment":
			return {
				url: row.attachmentUrl,
				mimeType: row.attachmentMimeType,
				fileName: row.attachmentFileName,
				sizeBytes: row.attachmentSizeBytes
			}
		case "post":
			return {
				platform: row.postPlatform,
				url: row.postUrl,
				title: row.postTitle,
				caption: row.postCaption
			}
		case "transfer":
			return {
				amount: row.transferAmount,
				currency: row.transferCurrency,
				state: row.transferState,
				reference: row.transferReference
			}
		default:
			return null
	}
}

const mapTimelineItem = (row: ConversationTimelineRow): ChatItem => ({
	id: row.itemId,
	type: row.itemType,
	senderType: row.itemSenderType,
	senderId: row.itemSenderId,
	createdAt: row.itemCreatedAt,
	payload: buildTimelinePayload(row)
})

const mapConversation = (conversation: ConversationRow, items: ChatItem[]): ConversationDetail => ({
	conversationId: conversation.conversationId,
	companyId: conversation.companyId,
	influencerId: conversation.influencerId,
	counterpart: {
		id: conversation.counterpartId,
		name: conversation.counterpartName,
		email: conversation.counterpartEmail,
		handle: conversation.counterpartHandle
	},
	items
})

const getCompanyPreviews = async (companyId: number): Promise<ConversationPreview[]> => {
	const rows = await getCompanyConversationPreviews(companyId)
	return rows.map(mapPreview)
}

const getInfluencerPreviews = async (influencerId: number): Promise<ConversationPreview[]> => {
	const rows = await getInfluencerConversationPreviews(influencerId)
	return rows.map(mapPreview)
}

const getCompanyConversationDetail = async (companyId: number, conversationId: number): Promise<ConversationDetail> => {
	const conversation = await getCompanyConversationById(companyId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}
	const items = await getConversationTimeline(conversationId)
	return mapConversation(conversation, items.map(mapTimelineItem))
}

const getInfluencerConversationDetail = async (influencerId: number, conversationId: number): Promise<ConversationDetail> => {
	const conversation = await getInfluencerConversationById(influencerId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}
	const items = await getConversationTimeline(conversationId)
	return mapConversation(conversation, items.map(mapTimelineItem))
}

const createCompanyMessage = async (companyId: number, conversationId: number, text: string): Promise<ChatItem> => {
	const conversation = await getCompanyConversationById(companyId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	const messageId = await createMessage(text)
	const chatItemId = await createMessageChatItem(conversationId, "company", companyId, messageId)
	const created = await getChatItemById(chatItemId)
	if (!created) {
		throw new HttpError(500, "Failed to create message")
	}
	return mapTimelineItem(created)
}

const createInfluencerMessage = async (influencerId: number, conversationId: number, text: string): Promise<ChatItem> => {
	const conversation = await getInfluencerConversationById(influencerId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	const messageId = await createMessage(text)
	const chatItemId = await createMessageChatItem(conversationId, "influencer", influencerId, messageId)
	const created = await getChatItemById(chatItemId)
	if (!created) {
		throw new HttpError(500, "Failed to create message")
	}
	return mapTimelineItem(created)
}

export {
	getCompanyPreviews,
	getInfluencerPreviews,
	getCompanyConversationDetail,
	getInfluencerConversationDetail,
	createCompanyMessage,
	createInfluencerMessage
}
export type { ConversationPreview, ConversationCounterpart, ChatItemPreview, ConversationDetail, ChatItem }
