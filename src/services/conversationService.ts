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
import { getChatItemById } from "../repositories/chatItemRepository"
import { createAttachment, createAttachmentChatItem, AttachmentInput } from "../repositories/attachmentRepository"
import { createMessage, createMessageChatItem } from "../repositories/messageRepository"
import { runInTransaction } from "../repositories/transaction"
import HttpError from "../utils/httpError"
import type { TimelineCursor } from "../utils/validation"
import { buildNextCursorFromPreview, buildNextCursorFromTimeline } from "./paginationService"

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

interface ConversationPreviewResult {
	conversations: ConversationPreview[]
	nextCursor: TimelineCursor | null
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

interface ConversationDetailResult {
	conversation: ConversationDetail
	nextCursor: TimelineCursor | null
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

const getCompanyPreviews = async (companyId: number, limit: number, cursor: TimelineCursor | null): Promise<ConversationPreviewResult> => {
	const rows = await getCompanyConversationPreviews(companyId, limit, cursor)
	return {
		conversations: rows.map(mapPreview),
		nextCursor: buildNextCursorFromPreview(rows, limit)
	}
}

const getInfluencerPreviews = async (influencerId: number, limit: number, cursor: TimelineCursor | null): Promise<ConversationPreviewResult> => {
	const rows = await getInfluencerConversationPreviews(influencerId, limit, cursor)
	return {
		conversations: rows.map(mapPreview),
		nextCursor: buildNextCursorFromPreview(rows, limit)
	}
}

const getCompanyConversationDetail = async (
	companyId: number,
	conversationId: number,
	limit: number,
	cursor: TimelineCursor | null
): Promise<ConversationDetailResult> => {
	const conversation = await getCompanyConversationById(companyId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	const rows = await getConversationTimeline(conversationId, limit, cursor)
	const nextCursor = buildNextCursorFromTimeline(rows, limit)

	const items = rows.map(mapTimelineItem).reverse()
	return {
		conversation: mapConversation(conversation, items),
		nextCursor
	}
}

const getInfluencerConversationDetail = async (
	influencerId: number,
	conversationId: number,
	limit: number,
	cursor: TimelineCursor | null
): Promise<ConversationDetailResult> => {
	const conversation = await getInfluencerConversationById(influencerId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	const rows = await getConversationTimeline(conversationId, limit, cursor)
	const nextCursor = buildNextCursorFromTimeline(rows, limit)

	const items = rows.map(mapTimelineItem).reverse()
	return {
		conversation: mapConversation(conversation, items),
		nextCursor
	}
}

const createCompanyMessage = async (companyId: number, conversationId: number, text: string): Promise<ChatItem> => {
	const conversation = await getCompanyConversationById(companyId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	return runInTransaction(async () => {
		const messageId = await createMessage(text)
		const chatItemId = await createMessageChatItem(conversationId, "company", companyId, messageId)
		const created = await getChatItemById(chatItemId)
		if (!created) {
			throw new HttpError(500, "Failed to create message")
		}
		return mapTimelineItem(created)
	})
}

const createInfluencerMessage = async (influencerId: number, conversationId: number, text: string): Promise<ChatItem> => {
	const conversation = await getInfluencerConversationById(influencerId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	return runInTransaction(async () => {
		const messageId = await createMessage(text)
		const chatItemId = await createMessageChatItem(conversationId, "influencer", influencerId, messageId)
		const created = await getChatItemById(chatItemId)
		if (!created) {
			throw new HttpError(500, "Failed to create message")
		}
		return mapTimelineItem(created)
	})
}

const createCompanyAttachment = async (companyId: number, conversationId: number, input: AttachmentInput): Promise<ChatItem> => {
	const conversation = await getCompanyConversationById(companyId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	return runInTransaction(async () => {
		const attachmentId = await createAttachment(input)
		const chatItemId = await createAttachmentChatItem(conversationId, "company", companyId, attachmentId)
		const created = await getChatItemById(chatItemId)
		if (!created) {
			throw new HttpError(500, "Failed to create attachment")
		}
		return mapTimelineItem(created)
	})
}

const createInfluencerAttachment = async (influencerId: number, conversationId: number, input: AttachmentInput): Promise<ChatItem> => {
	const conversation = await getInfluencerConversationById(influencerId, conversationId)
	if (!conversation) {
		throw new HttpError(404, "Conversation not found")
	}

	return runInTransaction(async () => {
		const attachmentId = await createAttachment(input)
		const chatItemId = await createAttachmentChatItem(conversationId, "influencer", influencerId, attachmentId)
		const created = await getChatItemById(chatItemId)
		if (!created) {
			throw new HttpError(500, "Failed to create attachment")
		}
		return mapTimelineItem(created)
	})
}

export {
	getCompanyPreviews,
	getInfluencerPreviews,
	getCompanyConversationDetail,
	getInfluencerConversationDetail,
	createCompanyMessage,
	createInfluencerMessage,
	createCompanyAttachment,
	createInfluencerAttachment
}
export type {
	ConversationPreview,
	ConversationPreviewResult,
	ConversationCounterpart,
	ChatItemPreview,
	ConversationDetail,
	ChatItem,
	ConversationDetailResult
}
