import { Response } from "express"

interface ErrorPayload {
	message: string
	code?: string
	details?: Record<string, unknown>
}

const sendSuccess = <T>(res: Response, data: T, meta?: Record<string, unknown>) => {
	return res.json({
		success: true,
		data,
		meta: meta ?? null
	})
}

const sendError = (res: Response, statusCode: number, error: ErrorPayload) => {
	return res.status(statusCode).json({
		success: false,
		error
	})
}

export { sendSuccess, sendError }
export type { ErrorPayload }
