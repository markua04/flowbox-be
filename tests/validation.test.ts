import { describe, expect, it } from "vitest"
import HttpError from "../src/utils/httpError"
import {
	parseAttachmentInput,
	parseConversationId,
	parseMessageText,
	parsePreviewPagination,
	parseTimelinePagination
} from "../src/utils/validation"

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

	it("parses attachment input", () => {
		const input = parseAttachmentInput({ url: "https://example.com/file.png", sizeBytes: 123 })
		expect(input.url).toBe("https://example.com/file.png")
		expect(input.sizeBytes).toBe(123)
	})

	it("rejects attachment without url", () => {
		expect(() => parseAttachmentInput({})).toThrow(HttpError)
	})

	it("uses default limit for preview pagination", () => {
		const pagination = parsePreviewPagination({}, 25)
		expect(pagination.limit).toBe(25)
		expect(pagination.cursor).toBeNull()
	})

	it("uses default limit for timeline pagination", () => {
		const pagination = parseTimelinePagination({}, 25)
		expect(pagination.limit).toBe(25)
		expect(pagination.cursor).toBeNull()
	})

	it("parses cursor values for preview pagination", () => {
		const pagination = parsePreviewPagination({ beforeCreatedAt: "2024-01-01 00:00:00", beforeId: "10", limit: "5" }, 25)
		expect(pagination.limit).toBe(5)
		expect(pagination.cursor?.beforeId).toBe(10)
	})

	it("parses cursor values for timeline pagination", () => {
		const pagination = parseTimelinePagination({ beforeCreatedAt: "2024-01-01 00:00:00", beforeId: "10", limit: "5" }, 25)
		expect(pagination.limit).toBe(5)
		expect(pagination.cursor?.beforeId).toBe(10)
	})
})
