"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_errors_1 = require("http-errors");
var middleware_1 = require("@/common/middleware");
var user_handlers_1 = require("./user_handlers");
var user_router = (0, express_1.Router)();
user_router.use(function (request, response, next) {
    if (!request.user) {
        throw new http_errors_1.default.Unauthorized();
    }
    next();
});
user_router
    .route("/")
    .get(user_handlers_1.default.getUserWithDetails, user_handlers_1.default.getUser)
    .patch(user_handlers_1.default.patchUserDetails, middleware_1.handleFailedAuthentication)
    .all((0, middleware_1.handleMethodNotAllowed)("GET", "PATCH"));
user_router
    .route("/check-in")
    .post(user_handlers_1.default.checkUserIn, middleware_1.handleFailedAuthentication)
    .all((0, middleware_1.handleMethodNotAllowed)("POST"));
exports.default = user_router;
