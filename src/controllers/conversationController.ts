import { Response } from "express"
import { AuthenticatedRequest } from "../middlewares/auth"
import { sendSuccess } from "../middlewares/response"
import HttpError from "../utils/httpError"
import {
	createCompanyMessage,
	createInfluencerMessage,
	getCompanyConversationDetail,
	getCompanyPreviews,
	getInfluencerConversationDetail,
	getInfluencerPreviews
} from "../services/conversationService"

const parseConversationId = (value: string | undefined) => {
	const parsed = Number(value)
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new HttpError(400, "Invalid conversation id")
	}
	return parsed
}

const parseMessageText = (value: unknown) => {
	if (typeof value !== "string") {
		throw new HttpError(400, "Message text is required")
	}
	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new HttpError(400, "Message text is required")
	}
	return trimmed
}

class ConversationController {
	static async listCompanyConversations(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversations = await getCompanyPreviews(companyId)
		return sendSuccess(res, { conversations })
	}

	static async listInfluencerConversations(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversations = await getInfluencerPreviews(influencerId)
		return sendSuccess(res, { conversations })
	}

	static async showCompanyConversation(req: AuthenticatedRequest, res: Response) {
		const companyId = req.user?.id
		if (!companyId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const conversation = await getCompanyConversationDetail(companyId, conversationId)
		return sendSuccess(res, conversation)
	}

	static async showInfluencerConversation(req: AuthenticatedRequest, res: Response) {
		const influencerId = req.user?.id
		if (!influencerId) {
			throw new HttpError(401, "Unauthorized")
		}

		const conversationId = parseConversationId(req.params.id)
		const conversation = await getInfluencerConversationDetail(influencerId, conversationId)
		return sendSuccess(res, conversation)
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
}

export default ConversationController
