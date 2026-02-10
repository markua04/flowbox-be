import { query } from "./db"

interface ConversationPreviewRow {
	conversationId: number
	companyId: number
	influencerId: number
	counterpartId: number
	counterpartName: string
	counterpartEmail: string
	counterpartHandle: string | null
	latestItemId: number | null
	latestItemType: string | null
	latestItemSenderType: string | null
	latestItemSenderId: number | null
	latestItemCreatedAt: string | null
	messageText: string | null
	attachmentUrl: string | null
	attachmentMimeType: string | null
	attachmentFileName: string | null
	attachmentSizeBytes: number | null
	postPlatform: string | null
	postUrl: string | null
	postTitle: string | null
	postCaption: string | null
	transferAmount: number | null
	transferCurrency: string | null
	transferState: string | null
	transferReference: string | null
}

interface ConversationRow {
	conversationId: number
	companyId: number
	influencerId: number
	counterpartId: number
	counterpartName: string
	counterpartEmail: string
	counterpartHandle: string | null
}

interface ConversationTimelineRow {
	itemId: number
	itemType: string
	itemSenderType: string
	itemSenderId: number
	itemCreatedAt: string
	messageText: string | null
	attachmentUrl: string | null
	attachmentMimeType: string | null
	attachmentFileName: string | null
	attachmentSizeBytes: number | null
	postPlatform: string | null
	postUrl: string | null
	postTitle: string | null
	postCaption: string | null
	transferAmount: number | null
	transferCurrency: string | null
	transferState: string | null
	transferReference: string | null
}

const getCompanyConversationPreviews = async (companyId: number): Promise<ConversationPreviewRow[]> => {
	const sql = `
		SELECT
			c.id as conversationId,
			c.company_id as companyId,
			c.influencer_id as influencerId,
			i.id as counterpartId,
			i.name as counterpartName,
			i.email as counterpartEmail,
			i.igUsername as counterpartHandle,
			ci.id as latestItemId,
			ci.type as latestItemType,
			ci.sender_type as latestItemSenderType,
			ci.sender_id as latestItemSenderId,
			ci.created_at as latestItemCreatedAt,
			m.text as messageText,
			a.url as attachmentUrl,
			a.mime_type as attachmentMimeType,
			a.file_name as attachmentFileName,
			a.size_bytes as attachmentSizeBytes,
			p.platform as postPlatform,
			p.url as postUrl,
			p.title as postTitle,
			p.caption as postCaption,
			t.amount as transferAmount,
			t.currency as transferCurrency,
			t.state as transferState,
			t.reference as transferReference
		FROM conversations c
		JOIN influencers i ON i.id = c.influencer_id
		LEFT JOIN chat_items ci ON ci.id = (
			SELECT id
			FROM chat_items
			WHERE conversation_id = c.id
			ORDER BY created_at DESC, id DESC
			LIMIT 1
		)
		LEFT JOIN messages m ON m.id = ci.message_id
		LEFT JOIN attachments a ON a.id = ci.attachment_id
		LEFT JOIN posted_contents p ON p.id = ci.post_id
		LEFT JOIN transfers t ON t.id = ci.transfer_id
		WHERE c.company_id = ?
		ORDER BY ci.created_at DESC, ci.id DESC
	`

	return query<ConversationPreviewRow>(sql, [companyId])
}

const getInfluencerConversationPreviews = async (influencerId: number): Promise<ConversationPreviewRow[]> => {
	const sql = `
		SELECT
			c.id as conversationId,
			c.company_id as companyId,
			c.influencer_id as influencerId,
			co.id as counterpartId,
			co.name as counterpartName,
			co.email as counterpartEmail,
			NULL as counterpartHandle,
			ci.id as latestItemId,
			ci.type as latestItemType,
			ci.sender_type as latestItemSenderType,
			ci.sender_id as latestItemSenderId,
			ci.created_at as latestItemCreatedAt,
			m.text as messageText,
			a.url as attachmentUrl,
			a.mime_type as attachmentMimeType,
			a.file_name as attachmentFileName,
			a.size_bytes as attachmentSizeBytes,
			p.platform as postPlatform,
			p.url as postUrl,
			p.title as postTitle,
			p.caption as postCaption,
			t.amount as transferAmount,
			t.currency as transferCurrency,
			t.state as transferState,
			t.reference as transferReference
		FROM conversations c
		JOIN companies co ON co.id = c.company_id
		LEFT JOIN chat_items ci ON ci.id = (
			SELECT id
			FROM chat_items
			WHERE conversation_id = c.id
			ORDER BY created_at DESC, id DESC
			LIMIT 1
		)
		LEFT JOIN messages m ON m.id = ci.message_id
		LEFT JOIN attachments a ON a.id = ci.attachment_id
		LEFT JOIN posted_contents p ON p.id = ci.post_id
		LEFT JOIN transfers t ON t.id = ci.transfer_id
		WHERE c.influencer_id = ?
		ORDER BY ci.created_at DESC, ci.id DESC
	`

	return query<ConversationPreviewRow>(sql, [influencerId])
}

const getCompanyConversationById = async (companyId: number, conversationId: number): Promise<ConversationRow | null> => {
	const sql = `
		SELECT
			c.id as conversationId,
			c.company_id as companyId,
			c.influencer_id as influencerId,
			i.id as counterpartId,
			i.name as counterpartName,
			i.email as counterpartEmail,
			i.igUsername as counterpartHandle
		FROM conversations c
		JOIN influencers i ON i.id = c.influencer_id
		WHERE c.company_id = ? AND c.id = ?
		LIMIT 1
	`

	const [row] = await query<ConversationRow>(sql, [companyId, conversationId])
	return row ?? null
}

const getInfluencerConversationById = async (influencerId: number, conversationId: number): Promise<ConversationRow | null> => {
	const sql = `
		SELECT
			c.id as conversationId,
			c.company_id as companyId,
			c.influencer_id as influencerId,
			co.id as counterpartId,
			co.name as counterpartName,
			co.email as counterpartEmail,
			NULL as counterpartHandle
		FROM conversations c
		JOIN companies co ON co.id = c.company_id
		WHERE c.influencer_id = ? AND c.id = ?
		LIMIT 1
	`

	const [row] = await query<ConversationRow>(sql, [influencerId, conversationId])
	return row ?? null
}

const getConversationTimeline = async (conversationId: number): Promise<ConversationTimelineRow[]> => {
	const sql = `
		SELECT
			ci.id as itemId,
			ci.type as itemType,
			ci.sender_type as itemSenderType,
			ci.sender_id as itemSenderId,
			ci.created_at as itemCreatedAt,
			m.text as messageText,
			a.url as attachmentUrl,
			a.mime_type as attachmentMimeType,
			a.file_name as attachmentFileName,
			a.size_bytes as attachmentSizeBytes,
			p.platform as postPlatform,
			p.url as postUrl,
			p.title as postTitle,
			p.caption as postCaption,
			t.amount as transferAmount,
			t.currency as transferCurrency,
			t.state as transferState,
			t.reference as transferReference
		FROM chat_items ci
		LEFT JOIN messages m ON m.id = ci.message_id
		LEFT JOIN attachments a ON a.id = ci.attachment_id
		LEFT JOIN posted_contents p ON p.id = ci.post_id
		LEFT JOIN transfers t ON t.id = ci.transfer_id
		WHERE ci.conversation_id = ?
		ORDER BY ci.created_at ASC, ci.id ASC
	`

	return query<ConversationTimelineRow>(sql, [conversationId])
}

export {
	getCompanyConversationPreviews,
	getInfluencerConversationPreviews,
	getCompanyConversationById,
	getInfluencerConversationById,
	getConversationTimeline
}

export type { ConversationPreviewRow, ConversationRow, ConversationTimelineRow }
