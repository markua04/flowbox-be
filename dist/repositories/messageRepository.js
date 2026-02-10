"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageChatItem = exports.createMessage = void 0;
const db_1 = require("./db");
const createMessage = async (text) => {
    return (0, db_1.insert)("INSERT INTO messages(text) VALUES(?)", [text]);
};
exports.createMessage = createMessage;
const createMessageChatItem = async (conversationId, senderType, senderId, messageId) => {
    return (0, db_1.insert)("INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, message_id) VALUES(?, ?, ?, ?, ?)", [conversationId, "message", senderType, senderId, messageId]);
};
exports.createMessageChatItem = createMessageChatItem;
