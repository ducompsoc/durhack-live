import config from "config"
import { App, Request, Response } from "@tinyhttp/app"
import { json, urlencoded } from "milliparsec"
import createHttpError from "http-errors"
import { cookieParser } from "@tinyhttp/cookie-parser"

import { handleMethodNotAllowed } from "@/common/middleware"
import { doubleCsrfProtection } from "@/auth/csrf"
import { oauthProvider } from "@/routes/auth/oauth/oauth-server"
import { Middleware } from "@/types/middleware";

import { authApp } from "./auth"
import { userApp } from "./user"
import { usersApp } from "./users"
import apiErrorHandler from "./error-handler"

const apiApp = new App({
  onError: apiErrorHandler
})

apiApp.use(json())
apiApp.use(urlencoded())

apiApp.use(
  oauthProvider.authenticate({
    scope: ["api"],
  }) as unknown as Middleware,
)

apiApp.use(cookieParser(config.get("cookie-parser.secret")))

function handle_root_request(request: Request, response: Response) {
  response.status(200)
  response.json({ status: response.statusCode, message: "OK", api_version: 1 })
}

function handle_unhandled_request() {
  throw new createHttpError.NotFound("Unknown API route.")
}

apiApp.route("/").get(handle_root_request).all(handleMethodNotAllowed("GET"))

apiApp.use("/auth", authApp)

if (config.get("csrf.enabled")) {
  apiApp.use(doubleCsrfProtection)
}

apiApp.use("/user", userApp)
apiApp.use("/users", usersApp)

apiApp.use(handle_unhandled_request)

export { apiApp }
