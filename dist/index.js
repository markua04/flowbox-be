"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const influencer_1 = tslib_1.__importDefault(require("./routes/influencer"));
const company_1 = tslib_1.__importDefault(require("./routes/company"));
const databaseService_1 = require("./services/databaseService");
const errorHandler_1 = tslib_1.__importDefault(require("./middlewares/errorHandler"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use("/influencer", influencer_1.default);
app.use("/company", company_1.default);
app.get("/", async (req, res) => {
    res.json({
        message: "Welcome!"
    });
});
app.use(errorHandler_1.default);
const startServer = async () => {
    await (0, databaseService_1.initializeDatabase)();
    app.listen(3000, () => {
        console.log("Example app listening on port 3000!");
    });
};
startServer();
