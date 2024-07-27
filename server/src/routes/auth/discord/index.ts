import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"

import { discordHandlers } from "./discord-handlers"

const discordApp = new App()

discordApp.route("/").get(discordHandlers.handleBeginDiscordOAuthFlow()).all(handleMethodNotAllowed("GET"))

discordApp.route("/redirect").get(discordHandlers.handleDiscordOAuthCallback()).all(handleMethodNotAllowed("GET"))

export { discordApp }
