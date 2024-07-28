import { App } from "@tinyhttp/app"

import { doubleCsrfProtection, handleGetCsrfToken } from "@/auth/csrf"
import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"
import { csrfConfig } from "@/config"

import { authHandlers } from "./auth-handlers"
import { discordApp } from "./discord"


const authApp = new App()

authApp.use("/discord", discordApp)

if (csrfConfig) {
  authApp.use(doubleCsrfProtection)
}

authApp.route("/csrf-token").get(handleGetCsrfToken).all(handleMethodNotAllowed("GET"))

authApp
  .route("/socket-token")
  .get(authHandlers.handleGetSocketToken(), handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET"))

export { authApp }
