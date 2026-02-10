//Setup express js
import express, { Request, Response } from "express"
import influencerRoutes from "./routes/influencer"
import companyRoutes from "./routes/company"
import { initializeDatabase } from "./services/databaseService"
import errorHandler from "./middlewares/errorHandler"

const app = express()
app.use(express.urlencoded({ extended: false, limit: "100kb" }))
app.use(express.json({ limit: "100kb" }))

app.use("/influencer", influencerRoutes)
app.use("/company", companyRoutes)

app.get("/", async (req: Request, res: Response) => {
	res.json({
		message: "Welcome!"
	})
})

app.use(errorHandler)

const startServer = async () => {
	await initializeDatabase()

	//Listen to port 3000
	app.listen(3000, () => {
		console.log("Example app listening on port 3000!")
	})
}

startServer()
