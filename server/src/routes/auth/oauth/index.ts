import { App } from "@otterhttp/app"

import { handleMethodNotAllowed } from "@/common/middleware"
import type { Request } from "@/request"
import type { Response } from "@/response"
import { oauthHandlers } from "@/routes/auth/oauth/oauth-handlers"

const oauthApp = new App<Request, Response>()

oauthApp
  .route("/authorize")
  .get(oauthHandlers.getAuthorize())
  .post(oauthHandlers.postAuthorize())
  .all(handleMethodNotAllowed("GET", "POST"))

oauthApp.route("/token").post(oauthHandlers.postToken()).all(handleMethodNotAllowed("POST"))

export { oauthApp }
