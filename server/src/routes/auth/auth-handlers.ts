import type { Request, Response } from "@tinyhttp/app"

import { requireLoggedIn } from "@/auth/decorators"
import type { User } from "@/database/tables"
import getStateSocketClient from "@/socket/oauth-client"

import { getSession } from "@/auth/session"
import createHttpError from "http-errors"
import { oauthModel } from "./oauth/model"

export class AuthHandlers {
  async handleLoginSuccess(request: Request & { user?: User }, response: Response) {
    if (request.user == null) {
      return response.redirect("/login")
    }

    const session = await getSession(request, response)
    if ("redirect_to" in session && typeof session.redirect_to === "string") {
      return response.redirect(session.redirect_to)
    }

    return response.redirect("/")
  }

  @requireLoggedIn
  async handleGetSocketToken(request: Request & { user?: User }, response: Response): Promise<void> {
    if (request.user == null) throw createHttpError(500)
    const auth_token = await oauthModel.generateAccessToken(await getStateSocketClient(), request.user, "socket:state")
    response.status(200)
    response.json({ status: 200, message: "Token generation OK", token: auth_token })
  }
}

export const authHandlers = new AuthHandlers()
