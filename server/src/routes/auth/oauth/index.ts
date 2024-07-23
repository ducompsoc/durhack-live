import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"
import { oauthHandlers } from "@/routes/auth/oauth/oauth-handlers"

const oauthApp = new App()

oauthApp
  .route("/authorize")
  .get(oauthHandlers.getAuthorize.bind(oauthHandlers))
  .post(oauthHandlers.postAuthorize.bind(oauthHandlers))
  .all(handleMethodNotAllowed("GET", "POST"))

oauthApp.route("/token").post(oauthHandlers.postToken.bind(oauthHandlers)).all(handleMethodNotAllowed("POST"))

export { oauthApp }
