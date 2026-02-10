"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const asyncHandler_1 = tslib_1.__importDefault(require("../middlewares/asyncHandler"));
const resource = (router, controller) => {
    if (controller.index) {
        router.get("/", (0, asyncHandler_1.default)(controller.index));
    }
    if (controller.show) {
        router.get("/:id", (0, asyncHandler_1.default)(controller.show));
    }
    if (controller.store) {
        router.post("/:id", (0, asyncHandler_1.default)(controller.store));
    }
};
exports.default = resource;
