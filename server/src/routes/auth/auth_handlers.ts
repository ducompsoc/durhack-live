import { Request, Response } from "@tinyhttp/app"

import { requireLoggedIn } from "@/auth/decorators"
import { User } from "@/database/tables"
import getStateSocketClient from "@/socket/oauth_client"

import { oauthModel } from "./oauth/model"
import { getSession } from "@/auth/session";

export default class AuthHandlers {
  static async handleLoginSuccess(request: Request & { user?: User }, response: Response) {
    if (!request.user) {
      return response.redirect("/login")
    }

    const session = await getSession(request, response)
    if ("redirect_to" in session && typeof session.redirect_to === "string") {
      return response.redirect(session.redirect_to)
    }

    return response.redirect("/")
  }

  @requireLoggedIn
  static async handleGetSocketToken(request: Request & { user?: User }, response: Response): Promise<void> {
    const auth_token = await oauthModel.generateAccessToken(await getStateSocketClient(), request.user!, "socket:state")
    response.status(200)
    response.json({ status: 200, message: "Token generation OK", token: auth_token })
  }
}
