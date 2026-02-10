"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const db_1 = require("../repositories/db");
const seedData = async () => {
    const existsInfluencer = await (0, db_1.query)("SELECT 1 as one FROM influencers", []);
    if (existsInfluencer.length === 0) {
        await (0, db_1.execute)("INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)", [
            "John Doe",
            "johndoe",
            "john@gmail.com",
            "7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983"
        ]);
        await (0, db_1.execute)("INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)", [
            "Camilla",
            "cam",
            "camilla@gmail.com",
            "7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983"
        ]);
    }
    const existsCompany = await (0, db_1.query)("SELECT 1 as one FROM companies", []);
    if (existsCompany.length === 0) {
        await (0, db_1.execute)("INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)", [
            "John Doe",
            13131313,
            "dream@dreaminfluencers.com",
            "7cf7e66906a6e38d1ac73fac3ed8438f35c0855fc7b195e5ba4f7f6018db4c9dfc7834cf3b4c7b19014265df17400ba9296113d6eb44d8448228ef1216f37983"
        ]);
    }
    const existsConversation = await (0, db_1.query)("SELECT 1 as one FROM conversations", []);
    if (existsConversation.length === 0) {
        const conversationId = await (0, db_1.insert)("INSERT INTO conversations(company_id, influencer_id) VALUES(?, ?)", [1, 1]);
        if (conversationId) {
            const messageId = await (0, db_1.insert)("INSERT INTO messages(text) VALUES(?)", ["Welcome to the chat"]);
            await (0, db_1.execute)("INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, message_id) VALUES(?, ?, ?, ?, ?)", [conversationId, "message", "company", 1, messageId]);
            const attachmentId = await (0, db_1.insert)("INSERT INTO attachments(url, mime_type, file_name, size_bytes) VALUES(?, ?, ?, ?)", ["https://example.com/files/brand-assets.pdf", "application/pdf", "brand-assets.pdf", 204800]);
            await (0, db_1.execute)("INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, attachment_id) VALUES(?, ?, ?, ?, ?)", [conversationId, "attachment", "company", 1, attachmentId]);
        }
    }
};
exports.seedData = seedData;
