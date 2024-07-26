import { App, type Request, type Response } from "@tinyhttp/app"
import { cookieParser } from "@tinyhttp/cookie-parser"
import createHttpError from "http-errors"
import { json, urlencoded } from "milliparsec"

import { doubleCsrfProtection } from "@/auth/csrf"
import { handleMethodNotAllowed } from "@/common/middleware"
import { cookieParserConfig, csrfConfig } from "@/config"
import { oauthProvider } from "@/routes/auth/oauth/oauth-server"
import type { Middleware } from "@/types/middleware"

import { authApp } from "./auth"
import apiErrorHandler from "./error-handler"
import { userApp } from "./user"
import { usersApp } from "./users"

const apiApp = new App({
  onError: apiErrorHandler,
})

apiApp.use(json())
apiApp.use(urlencoded())

apiApp.use(
  oauthProvider.authenticate({
    scope: "api" as unknown as string[], // https://github.com/node-oauth/node-oauth2-server/pull/305
  }) as unknown as Middleware,
)

apiApp.use(cookieParser(cookieParserConfig.secret))

function handle_root_request(request: Request, response: Response) {
  response.status(200)
  response.json({ status: response.statusCode, message: "OK", api_version: 1 })
}

function handle_unhandled_request() {
  throw new createHttpError.NotFound("Unknown API route.")
}

apiApp.route("/").get(handle_root_request).all(handleMethodNotAllowed("GET"))

apiApp.use("/auth", authApp)

if (csrfConfig.enabled) {
  apiApp.use(doubleCsrfProtection)
}

apiApp.use("/user", userApp)
apiApp.use("/users", usersApp)

apiApp.use(handle_unhandled_request)

export { apiApp }
