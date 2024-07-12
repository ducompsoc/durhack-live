"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var middleware_1 = require("@/common/middleware");
var discord_handlers_1 = require("./discord_handlers");
var discord_router = (0, express_1.Router)();
discord_router.route("/").get(discord_handlers_1.default.handleBeginDiscordOAuthFlow).all((0, middleware_1.handleMethodNotAllowed)("GET"));
discord_router.route("/redirect").get(discord_handlers_1.default.handleDiscordOAuthCallback).all((0, middleware_1.handleMethodNotAllowed)("GET"));
exports.default = discord_router;
