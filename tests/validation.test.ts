import { describe, expect, it } from "vitest"
import HttpError from "../src/utils/httpError"
import { parseConversationId, parseMessageText } from "../src/utils/validation"

describe("validation", () => {
	it("parses a valid conversation id", () => {
		expect(parseConversationId("42")).toBe(42)
	})

	it("rejects invalid conversation id", () => {
		expect(() => parseConversationId("abc")).toThrow(HttpError)
	})

	it("parses a valid message text", () => {
		expect(parseMessageText(" hello ")).toBe("hello")
	})

	it("rejects empty message text", () => {
		expect(() => parseMessageText("   ")).toThrow(HttpError)
	})
})
