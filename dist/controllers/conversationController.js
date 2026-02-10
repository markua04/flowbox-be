"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const response_1 = require("../middlewares/response");
const httpError_1 = tslib_1.__importDefault(require("../utils/httpError"));
const conversationService_1 = require("../services/conversationService");
const validation_1 = require("../utils/validation");
class ConversationController {
    static async listCompanyConversations(req, res) {
        const companyId = req.user?.id;
        if (!companyId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const pagination = (0, validation_1.parsePreviewPagination)(req.query, 25);
        const result = await (0, conversationService_1.getCompanyPreviews)(companyId, pagination.limit, pagination.cursor);
        return (0, response_1.sendSuccess)(res, { conversations: result.conversations }, { nextCursor: result.nextCursor });
    }
    static async listInfluencerConversations(req, res) {
        const influencerId = req.user?.id;
        if (!influencerId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const pagination = (0, validation_1.parsePreviewPagination)(req.query, 25);
        const result = await (0, conversationService_1.getInfluencerPreviews)(influencerId, pagination.limit, pagination.cursor);
        return (0, response_1.sendSuccess)(res, { conversations: result.conversations }, { nextCursor: result.nextCursor });
    }
    static async showCompanyConversation(req, res) {
        const companyId = req.user?.id;
        if (!companyId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const pagination = (0, validation_1.parseTimelinePagination)(req.query, 25);
        const result = await (0, conversationService_1.getCompanyConversationDetail)(companyId, conversationId, pagination.limit, pagination.cursor);
        return (0, response_1.sendSuccess)(res, result.conversation, { nextCursor: result.nextCursor });
    }
    static async showInfluencerConversation(req, res) {
        const influencerId = req.user?.id;
        if (!influencerId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const pagination = (0, validation_1.parseTimelinePagination)(req.query, 25);
        const result = await (0, conversationService_1.getInfluencerConversationDetail)(influencerId, conversationId, pagination.limit, pagination.cursor);
        return (0, response_1.sendSuccess)(res, result.conversation, { nextCursor: result.nextCursor });
    }
    static async storeCompanyMessage(req, res) {
        const companyId = req.user?.id;
        if (!companyId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const text = (0, validation_1.parseMessageText)(req.body?.text);
        const created = await (0, conversationService_1.createCompanyMessage)(companyId, conversationId, text);
        return (0, response_1.sendSuccess)(res, created);
    }
    static async storeInfluencerMessage(req, res) {
        const influencerId = req.user?.id;
        if (!influencerId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const text = (0, validation_1.parseMessageText)(req.body?.text);
        const created = await (0, conversationService_1.createInfluencerMessage)(influencerId, conversationId, text);
        return (0, response_1.sendSuccess)(res, created);
    }
    static async storeCompanyAttachment(req, res) {
        const companyId = req.user?.id;
        if (!companyId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const input = (0, validation_1.parseAttachmentInput)(req.body);
        const created = await (0, conversationService_1.createCompanyAttachment)(companyId, conversationId, input);
        return (0, response_1.sendSuccess)(res, created);
    }
    static async storeInfluencerAttachment(req, res) {
        const influencerId = req.user?.id;
        if (!influencerId) {
            throw new httpError_1.default(401, "Unauthorized");
        }
        const conversationId = (0, validation_1.parseConversationId)(req.params.id);
        const input = (0, validation_1.parseAttachmentInput)(req.body);
        const created = await (0, conversationService_1.createInfluencerAttachment)(influencerId, conversationId, input);
        return (0, response_1.sendSuccess)(res, created);
    }
}
exports.default = ConversationController;
