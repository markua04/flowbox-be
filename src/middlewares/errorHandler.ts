import { NextFunction, Request, Response } from "express"
import { sendError } from "./response"
import HttpError from "../utils/httpError"

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
	if (res.headersSent) {
		return next(err)
	}

	if (err instanceof HttpError) {
		return sendError(res, err.statusCode, {
			message: err.message,
			code: err.code,
			details: err.details
		})
	}

	console.error(err)
	return sendError(res, 500, {
		message: "Internal server error"
	})
}

export default errorHandler
