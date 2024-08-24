import { App } from "@otterhttp/app"

import { doubleCsrfProtection, handleGetCsrfToken } from "@/auth/csrf"
import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"
import { csrfConfig } from "@/config"
import type { Request } from "@/request"
import type { Response } from "@/response"

import { authHandlers } from "./auth-handlers"
import { discordApp } from "./discord"
import { keycloakApp } from "./keycloak"

const authApp = new App<Request, Response>()

authApp.use("/discord", discordApp)
authApp.use("/keycloak", keycloakApp)

if (csrfConfig.enabled) {
  authApp.use(doubleCsrfProtection)
}

authApp.route("/csrf-token").get(handleGetCsrfToken).all(handleMethodNotAllowed("GET"))

authApp
  .route("/socket-token")
  .get(authHandlers.handleGetSocketToken(), handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET"))

export { authApp }
