import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import {
	getCompanyConversationDetail,
	getCompanyPreviews
} from "../src/services/conversationService"

type ConversationRepo = typeof import("../src/repositories/conversationRepository")

vi.mock("../src/repositories/conversationRepository", () => ({
	getCompanyConversationPreviews: vi.fn(),
	getCompanyConversationById: vi.fn(),
	getConversationTimeline: vi.fn(),
	getInfluencerConversationPreviews: vi.fn(),
	getInfluencerConversationById: vi.fn()
}))

vi.mock("../src/repositories/chatItemRepository", () => ({
	getChatItemById: vi.fn()
}))

vi.mock("../src/repositories/messageRepository", () => ({
	createMessage: vi.fn(),
	createMessageChatItem: vi.fn()
}))

vi.mock("../src/repositories/attachmentRepository", () => ({
	createAttachment: vi.fn(),
	createAttachmentChatItem: vi.fn()
}))

vi.mock("../src/repositories/transaction", () => ({
	runInTransaction: (fn: () => Promise<unknown>) => fn()
}))

let conversationRepo: ConversationRepo

beforeAll(async () => {
	conversationRepo = await import("../src/repositories/conversationRepository")
})

describe("conversationService", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("maps preview payload for message", async () => {
		vi.mocked(conversationRepo.getCompanyConversationPreviews).mockResolvedValue([
			{
				conversationId: 1,
				companyId: 1,
				influencerId: 2,
				counterpartId: 2,
				counterpartName: "Jane",
				counterpartEmail: "jane@example.com",
				counterpartHandle: "jane",
				latestItemId: 10,
				latestItemType: "message",
				latestItemSenderType: "company",
				latestItemSenderId: 1,
				latestItemCreatedAt: "2024-01-01 00:00:00",
				messageText: "Hello",
				attachmentUrl: null,
				attachmentMimeType: null,
				attachmentFileName: null,
				attachmentSizeBytes: null,
				postPlatform: null,
				postUrl: null,
				postTitle: null,
				postCaption: null,
				transferAmount: null,
				transferCurrency: null,
				transferState: null,
				transferReference: null
			}
		])

		const result = await getCompanyPreviews(1, 25, null)
		expect(result.conversations).toHaveLength(1)
		expect(result.conversations[0].latestItem.payload).toEqual({ text: "Hello" })
	})

	it("returns chronological timeline and next cursor", async () => {
		vi.mocked(conversationRepo.getCompanyConversationById).mockResolvedValue({
			conversationId: 1,
			companyId: 1,
			influencerId: 2,
			counterpartId: 2,
			counterpartName: "Jane",
			counterpartEmail: "jane@example.com",
			counterpartHandle: "jane"
		})

		vi.mocked(conversationRepo.getConversationTimeline).mockResolvedValue([
			{
				itemId: 2,
				itemType: "message",
				itemSenderType: "company",
				itemSenderId: 1,
				itemCreatedAt: "2024-01-02 00:00:00",
				messageText: "Newest",
				attachmentUrl: null,
				attachmentMimeType: null,
				attachmentFileName: null,
				attachmentSizeBytes: null,
				postPlatform: null,
				postUrl: null,
				postTitle: null,
				postCaption: null,
				transferAmount: null,
				transferCurrency: null,
				transferState: null,
				transferReference: null
			},
			{
				itemId: 1,
				itemType: "message",
				itemSenderType: "company",
				itemSenderId: 1,
				itemCreatedAt: "2024-01-01 00:00:00",
				messageText: "Oldest",
				attachmentUrl: null,
				attachmentMimeType: null,
				attachmentFileName: null,
				attachmentSizeBytes: null,
				postPlatform: null,
				postUrl: null,
				postTitle: null,
				postCaption: null,
				transferAmount: null,
				transferCurrency: null,
				transferState: null,
				transferReference: null
			}
		])

		const result = await getCompanyConversationDetail(1, 1, 2, null)
		expect(result.conversation.items[0].payload).toEqual({ text: "Oldest" })
		expect(result.nextCursor).toEqual({
			beforeCreatedAt: "2024-01-01 00:00:00",
			beforeId: 1
		})
	})
})
