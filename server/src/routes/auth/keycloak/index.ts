import { App } from "@otterhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"
import { authHandlers } from "@/routes/auth/auth-handlers"

import { keycloakHandlers } from "./keycloak-handlers"

const keycloakApp = new App()

keycloakApp.route("/login").get(keycloakHandlers.beginOAuth2Flow()).all(handleMethodNotAllowed("GET"))

keycloakApp
  .route("/callback")
  .get(keycloakHandlers.oauth2FlowCallback())
  .get(authHandlers.handleLoginSuccess())
  .all(handleMethodNotAllowed("GET"))

export { keycloakApp }
