import { Router } from "express"
import authMiddleware from "../../middlewares/auth"
import ConversationController from "../../controllers/conversationController"
import resource from "../resource"

const router = Router()

router.use(authMiddleware)

resource(router, {
	index: ConversationController.listInfluencerConversations,
	show: ConversationController.showInfluencerConversation,
	store: ConversationController.storeInfluencerMessage
})

export default router
