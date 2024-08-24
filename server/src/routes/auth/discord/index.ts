import { App } from "@otterhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"
import type { Request } from "@/request"
import type { Response } from "@/response"

import { discordHandlers } from "./discord-handlers"

const discordApp = new App<Request, Response>()

discordApp.route("/").get(discordHandlers.handleBeginDiscordOAuthFlow()).all(handleMethodNotAllowed("GET"))

discordApp.route("/redirect").get(discordHandlers.handleDiscordOAuthCallback()).all(handleMethodNotAllowed("GET"))

export { discordApp }
