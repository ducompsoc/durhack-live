"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var passport_1 = require("passport");
var csrf_1 = require("@/auth/csrf");
var middleware_1 = require("@/common/middleware");
var discord_1 = require("./discord");
var oauth_1 = require("./oauth");
var auth_handlers_1 = require("./auth_handlers");
var config_1 = require("config");
var auth_router = (0, express_1.Router)();
auth_router.use("/discord", discord_1.default);
auth_router.use("/oauth", oauth_1.default);
if (config_1.default.get("csrf.enabled")) {
    auth_router.use(csrf_1.doubleCsrfProtection);
}
auth_router
    .route("/login")
    .get(auth_handlers_1.default.handleLoginSuccess)
    .post(passport_1.default.authenticate("local", {
    failWithError: true,
    keepSessionInfo: true,
}), auth_handlers_1.default.handleLoginSuccess)
    .all((0, middleware_1.handleMethodNotAllowed)("GET", "POST"));
auth_router.route("/check-verify").post(auth_handlers_1.default.handleCheckVerifyCode).all((0, middleware_1.handleMethodNotAllowed)("POST"));
auth_router.route("/check-email").post(auth_handlers_1.default.handleCheckEmail).all((0, middleware_1.handleMethodNotAllowed)("POST"));
auth_router.route("/verify-email").post(auth_handlers_1.default.handleVerifyEmail).all((0, middleware_1.handleMethodNotAllowed)("POST"));
auth_router
    .route("/set-password")
    .post(auth_handlers_1.default.handleSetPassword, passport_1.default.authenticate("local", {
    failWithError: true,
    keepSessionInfo: true,
}), auth_handlers_1.default.handleLoginSuccess)
    .all((0, middleware_1.handleMethodNotAllowed)("POST"));
auth_router.route("/csrf-token").get(csrf_1.handleGetCsrfToken).all((0, middleware_1.handleMethodNotAllowed)("GET"));
auth_router
    .route("/socket-token")
    .get(auth_handlers_1.default.handleGetSocketToken, middleware_1.handleFailedAuthentication)
    .all((0, middleware_1.handleMethodNotAllowed)("GET"));
exports.default = auth_router;
