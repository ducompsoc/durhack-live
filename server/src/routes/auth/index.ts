import { App } from "@tinyhttp/app"

import { doubleCsrfProtection, handleGetCsrfToken } from "@/auth/csrf"
import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"
import { csrfConfig } from "@/config";

import { discordApp } from "./discord"
import { oauthApp } from "./oauth"
import handlers from "./auth_handlers"

const authApp = new App()

authApp.use("/discord", discordApp)
authApp.use("/oauth", oauthApp)

if (csrfConfig) {
  authApp.use(doubleCsrfProtection)
}

authApp
  .route("/login")
  .get(handlers.handleLoginSuccess)
  .all(handleMethodNotAllowed("GET", "POST"))

authApp.route("/csrf-token").get(handleGetCsrfToken).all(handleMethodNotAllowed("GET"))

authApp
  .route("/socket-token")
  .get(handlers.handleGetSocketToken, handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET"))

export { authApp }
