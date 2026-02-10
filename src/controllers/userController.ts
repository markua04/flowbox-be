import { Response } from "express"
import { AuthenticatedRequest } from "../middlewares/auth"
import { sendSuccess } from "../middlewares/response"
import HttpError from "../utils/httpError"
import { getUserProfile } from "../services/userService"
import { UserType } from "../types/user"

class UserController {
	static async me(req: AuthenticatedRequest, res: Response, type: UserType) {
		const userId = req.user?.id
		if (!userId) {
			throw new HttpError(401, "Unauthorized")
		}

		const profile = await getUserProfile(userId, type)
		return sendSuccess(res, profile)
	}
}

export default UserController
