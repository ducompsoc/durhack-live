import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"

import { discordHandlers } from "./discord-handlers"

const discordApp = new App()

discordApp
  .route("/")
  .get(discordHandlers.handleBeginDiscordOAuthFlow.bind(discordHandlers))
  .all(handleMethodNotAllowed("GET"))

discordApp
  .route("/redirect")
  .get(discordHandlers.handleDiscordOAuthCallback.bind(discordHandlers))
  .all(handleMethodNotAllowed("GET"))

export { discordApp }
