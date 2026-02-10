"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const auth_1 = tslib_1.__importDefault(require("../../middlewares/auth"));
const conversationController_1 = tslib_1.__importDefault(require("../../controllers/conversationController"));
const resource_1 = tslib_1.__importDefault(require("../resource"));
const asyncHandler_1 = tslib_1.__importDefault(require("../../middlewares/asyncHandler"));
const router = (0, express_1.Router)();
router.use(auth_1.default);
(0, resource_1.default)(router, {
    index: conversationController_1.default.listInfluencerConversations,
    show: conversationController_1.default.showInfluencerConversation,
    store: conversationController_1.default.storeInfluencerMessage
});
router.post("/:id/attachments", (0, asyncHandler_1.default)(conversationController_1.default.storeInfluencerAttachment));
exports.default = router;
