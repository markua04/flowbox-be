import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import fs from "fs"
import os from "os"
import path from "path"

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "chat-repo-"))
const dbPath = path.join(tmpDir, "test.db")

let dbModule: typeof import("../src/repositories/db")
let repo: typeof import("../src/repositories/conversationRepository")
let createSchema: typeof import("../src/migrations/schema").createSchema

beforeAll(async () => {
	process.env.DB_PATH = dbPath
	vi.resetModules()

	dbModule = await import("../src/repositories/db")
	createSchema = (await import("../src/migrations/schema")).createSchema
	repo = await import("../src/repositories/conversationRepository")

	await createSchema()

	const companyId = await dbModule.insert(
		"INSERT INTO companies(name, CVR, email, passwordHash) VALUES(?, ?, ?, ?)",
		["ACME", 12345678, "acme@example.com", "hash"]
	)
	const influencerId = await dbModule.insert(
		"INSERT INTO influencers(name, igUsername, email, passwordHash) VALUES(?, ?, ?, ?)",
		["Jane", "jane", "jane@example.com", "hash"]
	)
	const conversationId = await dbModule.insert(
		"INSERT INTO conversations(company_id, influencer_id) VALUES(?, ?)",
		[companyId, influencerId]
	)
	const messageId = await dbModule.insert(
		"INSERT INTO messages(text) VALUES(?)",
		["Hello"]
	)
	await dbModule.execute(
		"INSERT INTO chat_items(conversation_id, type, sender_type, sender_id, message_id) VALUES(?, ?, ?, ?, ?)",
		[conversationId, "message", "company", companyId, messageId]
	)
})

afterAll(async () => {
	await new Promise<void>((resolve) => dbModule.db.close(() => resolve()))
	fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("conversationRepository", () => {
	it("returns company preview rows", async () => {
		const rows = await repo.getCompanyConversationPreviews(1, 25)
		expect(rows.length).toBe(1)
		expect(rows[0].latestItemType).toBe("message")
	})

	it("returns timeline rows", async () => {
		const rows = await repo.getConversationTimeline(1, 25, null)
		expect(rows.length).toBe(1)
		expect(rows[0].itemType).toBe("message")
	})
})
