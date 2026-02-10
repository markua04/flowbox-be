"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInfluencerAttachment = exports.createCompanyAttachment = exports.createInfluencerMessage = exports.createCompanyMessage = exports.getInfluencerConversationDetail = exports.getCompanyConversationDetail = exports.getInfluencerPreviews = exports.getCompanyPreviews = void 0;
const tslib_1 = require("tslib");
const conversationRepository_1 = require("../repositories/conversationRepository");
const chatItemRepository_1 = require("../repositories/chatItemRepository");
const attachmentRepository_1 = require("../repositories/attachmentRepository");
const messageRepository_1 = require("../repositories/messageRepository");
const transaction_1 = require("../repositories/transaction");
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const paginationService_1 = require("./paginationService");
const buildPreviewPayload = (row) => {
    switch (row.latestItemType) {
        case "message":
            return {
                text: row.messageText
            };
        case "attachment":
            return {
                url: row.attachmentUrl,
                mimeType: row.attachmentMimeType,
                fileName: row.attachmentFileName,
                sizeBytes: row.attachmentSizeBytes
            };
        case "post":
            return {
                platform: row.postPlatform,
                url: row.postUrl,
                title: row.postTitle,
                caption: row.postCaption
            };
        case "transfer":
            return {
                amount: row.transferAmount,
                currency: row.transferCurrency,
                state: row.transferState,
                reference: row.transferReference
            };
        default:
            return null;
    }
};
const mapPreview = (row) => ({
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
});
const buildTimelinePayload = (row) => {
    switch (row.itemType) {
        case "message":
            return {
                text: row.messageText
            };
        case "attachment":
            return {
                url: row.attachmentUrl,
                mimeType: row.attachmentMimeType,
                fileName: row.attachmentFileName,
                sizeBytes: row.attachmentSizeBytes
            };
        case "post":
            return {
                platform: row.postPlatform,
                url: row.postUrl,
                title: row.postTitle,
                caption: row.postCaption
            };
        case "transfer":
            return {
                amount: row.transferAmount,
                currency: row.transferCurrency,
                state: row.transferState,
                reference: row.transferReference
            };
        default:
            return null;
    }
};
const mapTimelineItem = (row) => ({
    id: row.itemId,
    type: row.itemType,
    senderType: row.itemSenderType,
    senderId: row.itemSenderId,
    createdAt: row.itemCreatedAt,
    payload: buildTimelinePayload(row)
});
const mapConversation = (conversation, items) => ({
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
});
const getCompanyPreviews = async (companyId, limit, cursor) => {
    const rows = await (0, conversationRepository_1.getCompanyConversationPreviews)(companyId, limit, cursor);
    return {
        conversations: rows.map(mapPreview),
        nextCursor: (0, paginationService_1.buildNextCursorFromPreview)(rows, limit)
    };
};
exports.getCompanyPreviews = getCompanyPreviews;
const getInfluencerPreviews = async (influencerId, limit, cursor) => {
    const rows = await (0, conversationRepository_1.getInfluencerConversationPreviews)(influencerId, limit, cursor);
    return {
        conversations: rows.map(mapPreview),
        nextCursor: (0, paginationService_1.buildNextCursorFromPreview)(rows, limit)
    };
};
exports.getInfluencerPreviews = getInfluencerPreviews;
const getCompanyConversationDetail = async (companyId, conversationId, limit, cursor) => {
    const conversation = await (0, conversationRepository_1.getCompanyConversationById)(companyId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    const rows = await (0, conversationRepository_1.getConversationTimeline)(conversationId, limit, cursor);
    const nextCursor = (0, paginationService_1.buildNextCursorFromTimeline)(rows, limit);
    const items = rows.map(mapTimelineItem).reverse();
    return {
        conversation: mapConversation(conversation, items),
        nextCursor
    };
};
exports.getCompanyConversationDetail = getCompanyConversationDetail;
const getInfluencerConversationDetail = async (influencerId, conversationId, limit, cursor) => {
    const conversation = await (0, conversationRepository_1.getInfluencerConversationById)(influencerId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    const rows = await (0, conversationRepository_1.getConversationTimeline)(conversationId, limit, cursor);
    const nextCursor = (0, paginationService_1.buildNextCursorFromTimeline)(rows, limit);
    const items = rows.map(mapTimelineItem).reverse();
    return {
        conversation: mapConversation(conversation, items),
        nextCursor
    };
};
exports.getInfluencerConversationDetail = getInfluencerConversationDetail;
const createCompanyMessage = async (companyId, conversationId, text) => {
    const conversation = await (0, conversationRepository_1.getCompanyConversationById)(companyId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    return (0, transaction_1.runInTransaction)(async () => {
        const messageId = await (0, messageRepository_1.createMessage)(text);
        const chatItemId = await (0, messageRepository_1.createMessageChatItem)(conversationId, "company", companyId, messageId);
        const created = await (0, chatItemRepository_1.getChatItemById)(chatItemId);
        if (!created) {
            throw new httpError_1.default(500, "Failed to create message");
        }
        return mapTimelineItem(created);
    });
};
exports.createCompanyMessage = createCompanyMessage;
const createInfluencerMessage = async (influencerId, conversationId, text) => {
    const conversation = await (0, conversationRepository_1.getInfluencerConversationById)(influencerId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    return (0, transaction_1.runInTransaction)(async () => {
        const messageId = await (0, messageRepository_1.createMessage)(text);
        const chatItemId = await (0, messageRepository_1.createMessageChatItem)(conversationId, "influencer", influencerId, messageId);
        const created = await (0, chatItemRepository_1.getChatItemById)(chatItemId);
        if (!created) {
            throw new httpError_1.default(500, "Failed to create message");
        }
        return mapTimelineItem(created);
    });
};
exports.createInfluencerMessage = createInfluencerMessage;
const createCompanyAttachment = async (companyId, conversationId, input) => {
    const conversation = await (0, conversationRepository_1.getCompanyConversationById)(companyId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    return (0, transaction_1.runInTransaction)(async () => {
        const attachmentId = await (0, attachmentRepository_1.createAttachment)(input);
        const chatItemId = await (0, attachmentRepository_1.createAttachmentChatItem)(conversationId, "company", companyId, attachmentId);
        const created = await (0, chatItemRepository_1.getChatItemById)(chatItemId);
        if (!created) {
            throw new httpError_1.default(500, "Failed to create attachment");
        }
        return mapTimelineItem(created);
    });
};
exports.createCompanyAttachment = createCompanyAttachment;
const createInfluencerAttachment = async (influencerId, conversationId, input) => {
    const conversation = await (0, conversationRepository_1.getInfluencerConversationById)(influencerId, conversationId);
    if (!conversation) {
        throw new httpError_1.default(404, "Conversation not found");
    }
    return (0, transaction_1.runInTransaction)(async () => {
        const attachmentId = await (0, attachmentRepository_1.createAttachment)(input);
        const chatItemId = await (0, attachmentRepository_1.createAttachmentChatItem)(conversationId, "influencer", influencerId, attachmentId);
        const created = await (0, chatItemRepository_1.getChatItemById)(chatItemId);
        if (!created) {
            throw new httpError_1.default(500, "Failed to create attachment");
        }
        return mapTimelineItem(created);
    });
};
exports.createInfluencerAttachment = createInfluencerAttachment;
