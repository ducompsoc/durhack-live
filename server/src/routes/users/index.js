"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var middleware_1 = require("@/common/middleware");
var users_handlers_1 = require("./users_handlers");
var users_router = (0, express_1.Router)();
users_router.route("/").get(users_handlers_1.default.getUsersList).post(users_handlers_1.default.createUser).all((0, middleware_1.handleMethodNotAllowed)("GET", "POST"));
users_router
    .route("/:user_id")
    .all((0, middleware_1.parseRouteId)("user_id"))
    .get(users_handlers_1.default.getUserDetails)
    .patch(users_handlers_1.default.patchUserDetails)
    .delete(users_handlers_1.default.deleteUser)
    .all((0, middleware_1.handleMethodNotAllowed)("GET", "PATCH", "DELETE"));
exports.default = users_router;
