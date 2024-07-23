import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"

import handlers from "./discord_handlers"

const discordApp = new App()

discordApp.route("/").get(handlers.handleBeginDiscordOAuthFlow).all(handleMethodNotAllowed("GET"))

discordApp.route("/redirect").get(handlers.handleDiscordOAuthCallback).all(handleMethodNotAllowed("GET"))

export { discordApp }
