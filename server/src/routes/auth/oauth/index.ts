import { App } from "@tinyhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"
import handlers from "@/routes/auth/oauth/oauth_handlers"

const oauthApp = new App()

oauthApp
  .route("/authorize")
  .get(handlers.getAuthorize)
  .post(handlers.postAuthorize)
  .all(handleMethodNotAllowed("GET", "POST"))

oauthApp.route("/token").post(handlers.postToken).all(handleMethodNotAllowed("POST"))

export { oauthApp }
