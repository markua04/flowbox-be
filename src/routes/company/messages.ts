import { Router } from "express"
import authMiddleware from "../../middlewares/auth"
import ConversationController from "../../controllers/conversationController"
import resource from "../resource"
import asyncHandler from "../../middlewares/asyncHandler"

const router = Router()

router.use(authMiddleware)

resource(router, {
	index: ConversationController.listCompanyConversations,
	show: ConversationController.showCompanyConversation,
	store: ConversationController.storeCompanyMessage
})

router.post("/:id/attachments", asyncHandler(ConversationController.storeCompanyAttachment))

export default router
