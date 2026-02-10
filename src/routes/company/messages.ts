import { Router } from "express"
import authMiddleware from "../../middlewares/auth"
import ConversationController from "../../controllers/conversationController"
import resource from "../resource"

const router = Router()

router.use(authMiddleware)

resource(router, {
	index: ConversationController.listCompanyConversations,
	show: ConversationController.showCompanyConversation,
	store: ConversationController.storeCompanyMessage
})

export default router
