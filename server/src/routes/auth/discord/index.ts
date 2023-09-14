import { Router as ExpressRouter } from "express";

import { handleMethodNotAllowed } from "@/common/middleware";

import handlers from "./discord_handlers";

const discord_router = ExpressRouter();

discord_router.route("/")
  .get(handlers.handleBeginDiscordOAuthFlow)
  .all(handleMethodNotAllowed("GET"));

discord_router.route("/redirect")
  .get(handlers.handleDiscordOAuthCallback)
  .all(handleMethodNotAllowed("GET"));

export default discord_router;
