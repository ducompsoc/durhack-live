import assert from "node:assert/strict"
import { TokenType } from "@durhack/token-vault/lib"
import createHttpError from "http-errors"

import { requireLoggedIn } from "@/auth/decorators"
import { getSession } from "@/auth/session"
import TokenVault from "@/auth/tokens"
import type { User } from "@/database"
import type { Request } from "@/request"
import type { Response } from "@/response"
import type { Middleware } from "@/types/middleware"

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
    return async (request: Request, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      assert(request.userProfile)

      const auth_token = await TokenVault.createToken(TokenType.accessToken, request.user, {
        scope: ["socket:state"],
        claims: {
          client_id: "megateams-socket",
        },
      })
      response.status(200)
      response.json({ status: 200, message: "Token generation OK", token: auth_token })
    }
  }
}

export const authHandlers = new AuthHandlers()
