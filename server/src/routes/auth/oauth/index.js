"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var middleware_1 = require("@/common/middleware");
var oauth_handlers_1 = require("@/routes/auth/oauth/oauth_handlers");
var oauth_router = (0, express_1.Router)();
oauth_router
    .route("/authorize")
    .get(oauth_handlers_1.default.getAuthorize)
    .post(oauth_handlers_1.default.postAuthorize)
    .all((0, middleware_1.handleMethodNotAllowed)("GET", "POST"));
oauth_router.route("/token").post(oauth_handlers_1.default.postToken).all((0, middleware_1.handleMethodNotAllowed)("POST"));
exports.default = oauth_router;
