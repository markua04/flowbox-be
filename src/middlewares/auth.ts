import { Request, Response, NextFunction } from "express"
import { query } from "../repositories/db"

const error = "Please set a Authentication header by setting a header called \"authorization john@gmail.com:influencer or dream@dreaminfluencers.com:company\""
interface User {
	id: number
	email: string
}
export interface AuthenticatedRequest extends Request {
	user?: User
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
	const headers = req.headers
	const token = headers.authorization
	if (!token) {
		return res.status(401).json({ error })
	}
	const [email, platform] = token.split(":")
	if (!email || !platform) {
		return res.status(401).json({ error })
	}
	if (platform !== "influencer" && platform !== "company") {
		return res.status(401).json({ error })
	}
	const platformTable = platform === "influencer" ? "influencers" : "companies"
	const sql = `SELECT id, email FROM ${platformTable} WHERE email = ?`
	const [user] = await query<User>(sql, [email])
	if (!user) {
		return res.status(401).json({ error, message: "User not found" })
	}
	req.user = user
	return next()
}

export default authMiddleware
