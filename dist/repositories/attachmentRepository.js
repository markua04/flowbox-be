"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentChatItem = exports.createAttachment = void 0;
const db_1 = require("./db");
const createAttachment = async (input) => {
    return (0, db_1.insert)("INSERT INTO attachments(url, mime_type, file_name, size_bytes) VALUES(?, ?, ?, ?)", [input.url, input.mimeType ?? null, input.fileName ?? null, input.sizeBytes ?? null]);
};
exports.createAttachment = createAttachment;
const createAttachmentChatItem = async (conversationId, senderType, senderId, attachmentId) => {
    return (0, db_1.insert)("INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, attachment_id) VALUES(?, ?, ?, ?, ?)", [conversationId, "attachment", senderType, senderId, attachmentId]);
};
exports.createAttachmentChatItem = createAttachmentChatItem;
