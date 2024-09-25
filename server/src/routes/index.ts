import assert from "node:assert/strict"
import { App } from "@otterhttp/app"
import { ServerError } from "@otterhttp/errors"
import createHttpError from "http-errors"
import type { UserinfoResponse } from "openid-client"

import { adaptTokenSetToClient, adaptTokenSetToDatabase } from "@/auth/adapt-token-set"
import { doubleCsrfProtection } from "@/auth/csrf"
import { type KeycloakUserInfo, keycloakClient } from "@/auth/keycloak-client"
import { getSession } from "@/auth/session"
import { isNetworkError } from "@/common/is-network-error"
import { handleMethodNotAllowed } from "@/common/middleware"
import { csrfConfig } from "@/config"
import { prisma } from "@/database"
import type { Request } from "@/request"
import type { Response } from "@/response"

import { authApp } from "./auth"
import { apiErrorHandler } from "./error-handler"
import { userApp } from "./user"

const apiApp = new App<Request, Response>({
  onError: apiErrorHandler,
})

apiApp.use(async (request, response, next) => {
  const session = await getSession(request, response)
  if (session.userId == null) return next()
  const user = await prisma.user.findUnique({
    where: { keycloakUserId: session.userId },
    include: { tokenSet: true },
  })

  if (user == null || user.tokenSet == null) {
    session.userId = undefined
    await session.commit()
    return next()
  }

  // if the token set has expired, we try to refresh it
  let tokenSet = adaptTokenSetToClient(user.tokenSet)
  if (tokenSet.expired() && tokenSet.refresh_token != null) {
    try {
      tokenSet = await keycloakClient.refresh(tokenSet.refresh_token)
      await prisma.tokenSet.update({
        where: { userId: user.keycloakUserId },
        data: adaptTokenSetToDatabase(tokenSet),
      })
    } catch (error) {
      if (isNetworkError(error)) {
        throw new ServerError("Encountered network error while attempting to refresh a token set", {
          statusCode: 500,
          exposeMessage: false,
          cause: error,
        })
      }
      assert(error instanceof Error)
      console.error(`Failed to refresh access token for ${tokenSet.claims().email}: ${error.stack}`)
    }
  }

  // if the token set is still expired, the user needs to log in again
  if (tokenSet.expired() || tokenSet.access_token == null) {
    session.userId = undefined
    await session.commit()
    return next()
  }

  // use the token set to get the user profile
  let profile: UserinfoResponse<KeycloakUserInfo> | undefined
  try {
    profile = await keycloakClient.userinfo<KeycloakUserInfo>(tokenSet.access_token)
  } catch (error) {
    if (isNetworkError(error)) {
      throw new ServerError("Encountered network error while attempting to fetch profile info", {
        statusCode: 500,
        exposeMessage: false,
        cause: error,
      })
    }

    assert(error instanceof Error)
    console.error(`Failed to fetch profile info for ${tokenSet.claims().email}: ${error.stack}`)

    // if the access token is rejected, the user needs to log in again
    session.userId = undefined
    await session.commit()
    return next()
  }

  request.userProfile = profile
  request.userTokenSet = tokenSet
  request.user = user
  next()
})

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

apiApp.use(handle_unhandled_request)

export { apiApp }
