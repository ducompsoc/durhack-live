import type { Request, Response } from "@tinyhttp/app"

import { requireLoggedIn } from "@/auth/decorators"
import type { User } from "@/database"
import getStateSocketClient from "@/socket/oauth-client"

import { getSession } from "@/auth/session"
import { adaptDatabaseOAuthClient } from "@/routes/auth/oauth/adapt-database-oauth-client"
import type { Middleware } from "@/types/middleware"
import createHttpError from "http-errors"
import { oauthModel } from "./oauth/model"

export class AuthHandlers {
  handleLoginSuccess() {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) {
        return response.redirect("/login")
      }

      const session = await getSession(request, response)
      if ("redirect_to" in session && typeof session.redirect_to === "string") {
        return response.redirect(session.redirect_to)
      }

      return response.redirect("/")
    }
  }

  @requireLoggedIn()
  handleGetSocketToken(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      const client = await getStateSocketClient()
      const auth_token = await oauthModel.generateAccessToken(
        adaptDatabaseOAuthClient(client),
        request.user,
        "socket:state",
      )
      response.status(200)
      response.json({ status: 200, message: "Token generation OK", token: auth_token })
    }
  }
}

export const authHandlers = new AuthHandlers()
