import { Response } from "express"
import { AuthenticatedRequest } from "../middlewares/auth"
import { sendSuccess } from "../middlewares/response"
import HttpError from "../utils/httpError"
import {
	createCompanyAttachment,
	createCompanyMessage,
	createInfluencerAttachment,
	createInfluencerMessage,
	getCompanyConversationDetail,
	getCompanyPreviews,
	getInfluencerConversationDetail,
	getInfluencerPreviews
} from "../services/conversationService"
import { parsePreviewPagination, parseTimelinePagination } from "../utils/pagination"
import { parseAttachmentInput, parseConversationId, parseMessageText } from "../utils/validation"

class ConversationController {
	static async listCompanyConversations(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const pagination = parsePreviewPagination(req.query)
		const result = await getCompanyPreviews(companyId, pagination.limit, pagination.cursor)
		return sendSuccess(res, { conversations: result.conversations }, { nextCursor: result.nextCursor })
	}

	static async listInfluencerConversations(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const pagination = parsePreviewPagination(req.query)
		const result = await getInfluencerPreviews(influencerId, pagination.limit, pagination.cursor)
		return sendSuccess(res, { conversations: result.conversations }, { nextCursor: result.nextCursor })
	}

	static async showCompanyConversation(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const pagination = parseTimelinePagination(req.query)
		const result = await getCompanyConversationDetail(companyId, conversationId, pagination.limit, pagination.cursor)
		return sendSuccess(res, result.conversation, { nextCursor: result.nextCursor })
	}

	static async showInfluencerConversation(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const pagination = parseTimelinePagination(req.query)
		const result = await getInfluencerConversationDetail(influencerId, conversationId, pagination.limit, pagination.cursor)
		return sendSuccess(res, result.conversation, { nextCursor: result.nextCursor })
	}

	static async storeCompanyMessage(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const text = parseMessageText(req.body?.text)
		const created = await createCompanyMessage(companyId, conversationId, text)
		return sendSuccess(res, created)
	}

	static async storeInfluencerMessage(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const text = parseMessageText(req.body?.text)
		const created = await createInfluencerMessage(influencerId, conversationId, text)
		return sendSuccess(res, created)
	}

	static async storeCompanyAttachment(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const input = parseAttachmentInput(req.body)
		const created = await createCompanyAttachment(companyId, conversationId, input)
		return sendSuccess(res, created)
	}

	static async storeInfluencerAttachment(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const input = parseAttachmentInput(req.body)
		const created = await createInfluencerAttachment(influencerId, conversationId, input)
		return sendSuccess(res, created)
	}
}

export default ConversationController
