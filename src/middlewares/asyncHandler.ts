import { NextFunction, Request, Response } from "express"

const asyncHandler = <T extends Request>(handler: (req: T, res: Response, next: NextFunction) => Promise<unknown>) => {
	return (req: T, res: Response, next: NextFunction) => {
		Promise.resolve(handler(req, res, next)).catch(next)
	}
}

export default asyncHandler
