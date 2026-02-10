"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationTimeline = exports.getInfluencerConversationById = exports.getCompanyConversationById = exports.getInfluencerConversationPreviews = exports.getCompanyConversationPreviews = void 0;
const db_1 = require("./db");
const pagination_1 = require("../utils/pagination");
const getCompanyConversationPreviews = async (companyId, limit, cursor) => {
    let sql = `
		WITH latest_items AS (
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
		)
		SELECT * FROM latest_items
		WHERE 1 = 1
	`;
    const params = [companyId];
    const cursorClause = (0, pagination_1.buildPreviewCursorClause)(cursor);
    if (cursorClause.clause) {
        sql += cursorClause.clause;
        params.push(...cursorClause.params);
    }
    sql += " ORDER BY latestItemCreatedAt DESC, latestItemId DESC LIMIT ?";
    params.push(limit);
    return (0, db_1.query)(sql, params);
};
exports.getCompanyConversationPreviews = getCompanyConversationPreviews;
const getInfluencerConversationPreviews = async (influencerId, limit, cursor) => {
    let sql = `
		WITH latest_items AS (
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
		)
		SELECT * FROM latest_items
		WHERE 1 = 1
	`;
    const params = [influencerId];
    const cursorClause = (0, pagination_1.buildPreviewCursorClause)(cursor);
    if (cursorClause.clause) {
        sql += cursorClause.clause;
        params.push(...cursorClause.params);
    }
    sql += " ORDER BY latestItemCreatedAt DESC, latestItemId DESC LIMIT ?";
    params.push(limit);
    return (0, db_1.query)(sql, params);
};
exports.getInfluencerConversationPreviews = getInfluencerConversationPreviews;
const getCompanyConversationById = async (companyId, conversationId) => {
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
	`;
    const [row] = await (0, db_1.query)(sql, [companyId, conversationId]);
    return row ?? null;
};
exports.getCompanyConversationById = getCompanyConversationById;
const getInfluencerConversationById = async (influencerId, conversationId) => {
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
	`;
    const [row] = await (0, db_1.query)(sql, [influencerId, conversationId]);
    return row ?? null;
};
exports.getInfluencerConversationById = getInfluencerConversationById;
const getConversationTimeline = async (conversationId, limit, cursor) => {
    let sql = `
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
	`;
    const params = [conversationId];
    const cursorClause = (0, pagination_1.buildTimelineCursorClause)(cursor);
    if (cursorClause.clause) {
        sql += cursorClause.clause;
        params.push(...cursorClause.params);
    }
    sql += " ORDER BY ci.created_at DESC, ci.id DESC LIMIT ?";
    params.push(limit);
    return (0, db_1.query)(sql, params);
};
exports.getConversationTimeline = getConversationTimeline;
