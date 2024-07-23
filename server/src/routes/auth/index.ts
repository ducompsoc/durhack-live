import { App } from "@tinyhttp/app"

import { doubleCsrfProtection, handleGetCsrfToken } from "@/auth/csrf"
import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"
import { csrfConfig } from "@/config"

import { authHandlers } from "./auth-handlers"
import { discordApp } from "./discord"
import { oauthApp } from "./oauth"

const authApp = new App()

authApp.use("/discord", discordApp)
authApp.use("/oauth", oauthApp)

if (csrfConfig) {
  authApp.use(doubleCsrfProtection)
}

authApp
  .route("/login")
  .get(authHandlers.handleLoginSuccess.bind(authHandlers))
  .all(handleMethodNotAllowed("GET", "POST"))

authApp.route("/csrf-token").get(handleGetCsrfToken).all(handleMethodNotAllowed("GET"))

authApp
  .route("/socket-token")
  .get(authHandlers.handleGetSocketToken.bind(authHandlers), handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET"))

export { authApp }
