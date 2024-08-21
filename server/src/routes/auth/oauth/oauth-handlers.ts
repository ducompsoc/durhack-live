import { stringify as stringifyQuery } from "node:querystring"
import type { NextFunction, Request, Response } from "@otterhttp/app"
import createHttpError from "http-errors"
import { z } from "zod"

import { getSession } from "@/auth/session"
import { NullError } from "@/common/errors"
import { type User, prisma } from "@/database"
import type { Middleware } from "@/types/middleware"

import { adaptDatabaseOAuthClient } from "@/routes/auth/oauth/adapt-database-oauth-client"
import { oauthModel } from "./model"
import { type TinyHttpOAuthServer, oauthProvider } from "./oauth-server"

class OAuthHandlers {
  provider: TinyHttpOAuthServer

  constructor(provider: TinyHttpOAuthServer) {
    this.provider = provider
  }

  static get_authorize_query_params_schema = z.object({
    client_id: z.string(),
    redirect_uri: z.string().url().optional(),
  })

  getAuthorize(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (!request.user) {
        const session = await getSession(request, response)
        session.redirect_to = `/login/authorize?${stringifyQuery(request.query)}`
        response.redirect("/login")
        // we have to save session manually - as we redirect, save() is not called automatically
        await session.commit()
        return
      }

      const { client_id, redirect_uri } = OAuthHandlers.get_authorize_query_params_schema.parse(request.query)
      const client = await prisma.oAuthClient.findUnique({
        where: {
          clientId: client_id,
        },
      })
      if (client == null) throw new NullError("OAuth client not found.")

      const oauth2ServerClient = adaptDatabaseOAuthClient(client)

      if (redirect_uri && !(await oauthModel.validateRedirectUri(redirect_uri, oauth2ServerClient))) {
        throw new createHttpError.BadRequest("Invalid redirect URI.")
      }

      response.status(200)
      response.json({
        status: response.statusCode,
        message: "OK",
        user: {
          // todo: keycloak API call to retrieve preferred name
          name: request.user.keycloakUserId,
        },
        client: {
          name: client.name,
          redirect_uri: redirect_uri ?? (client.redirectUris as string[])[0] ?? null,
        },
      })
    }
  }

  static authorizeOptions = {
    authenticateHandler: {
      handle: (request: Request & { user?: User }) => request.user,
    },
  }

  postAuthorize(): Middleware {
    const authorize = this.provider.authorize(OAuthHandlers.authorizeOptions).bind(this.provider)

    return async (request: Request, response: Response, next: NextFunction) => {
      const session = await getSession(request, response)
      session.redirect_to = undefined
      await session.commit()

      await authorize(request, response, next)
    }
  }

  static tokenOptions = {}

  postToken(): Middleware {
    const token = this.provider.token(OAuthHandlers.tokenOptions).bind(this.provider)

    return async (request: Request, response: Response, next: NextFunction) => {
      await token(request, response, next)
    }
  }
}

export const oauthHandlers = new OAuthHandlers(oauthProvider)
