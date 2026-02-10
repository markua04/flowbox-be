import { Router } from "express"
import authMiddleware, { AuthenticatedRequest } from "../middlewares/auth"
import UserController from "../controllers/userController"
import asyncHandler from "../middlewares/asyncHandler"
import { UserType } from "../types/user"

export default (router: Router, type: UserType) => {
	router.get("/me", authMiddleware, asyncHandler((req: AuthenticatedRequest, res) => {
		return UserController.me(req, res, type)
	}))

	return router
}
