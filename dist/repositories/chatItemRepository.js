"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatItemById = void 0;
const db_1 = require("./db");
const getChatItemById = async (chatItemId) => {
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
		WHERE ci.id = ?
		LIMIT 1
	`;
    const [row] = await (0, db_1.query)(sql, [chatItemId]);
    return row ?? null;
};
exports.getChatItemById = getChatItemById;
