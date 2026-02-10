import { Router, Request, Response } from "express"
const router = Router()
import userDecorator from "../../decorators/user"
import messagesRouter from "./messages"
router.use("/messages", messagesRouter)

router.get("/", async (req: Request, res: Response) => {
	res.json({
		message: "Influencer Platform!"
	})
})

export default userDecorator(router, "influencer")
