import { Router, Response, NextFunction } from "express"
import { AuthenticatedRequest } from "../middlewares/auth"
import asyncHandler from "../middlewares/asyncHandler"

interface ResourceController {
	index?: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<unknown>
	show?: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<unknown>
	store?: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<unknown>
}

const resource = (router: Router, controller: ResourceController) => {
	if (controller.index) {
		router.get("/", asyncHandler(controller.index))
	}
	if (controller.show) {
		router.get("/:id", asyncHandler(controller.show))
	}
	if (controller.store) {
		router.post("/:id", asyncHandler(controller.store))
	}
}

export default resource
