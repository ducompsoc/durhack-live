import { NextFunction, Request, Response } from "@tinyhttp/app"
import { z } from "zod"
import { stringify as stringifyQuery } from "node:querystring"
import createHttpError from "http-errors"

import { getSession } from "@/auth/session";
import { OAuthClient, User } from "@/database/tables"
import { NullError } from "@/common/errors"

import { oauthModel } from "./model"
import { oauthProvider, TinyHttpOAuthServer } from "./oauth-server"

class OAuthHandlers {
  provider: TinyHttpOAuthServer

  constructor(provider: TinyHttpOAuthServer) {
    this.provider = provider

    Object.getOwnPropertyNames(OAuthHandlers.prototype).forEach(key => {
      if (key !== "constructor") {
        // @ts-ignore
        this[key] = this[key].bind(this)
      }
    })
  }

  static get_authorize_query_params_schema = z.object({
    client_id: z.string(),
    redirect_uri: z.string().url().optional(),
  })

  async getAuthorize(request: Request & { user?: User }, response: Response) {
    if (!request.user) {
      const session = await getSession(request, response)
      session.redirect_to = "/login/authorize?" + stringifyQuery(request.query)
      response.redirect("/login")
      // we have to save session manually - as we redirect, save() is not called automatically
      await session.commit()
      return
    }

    const { client_id, redirect_uri } = OAuthHandlers.get_authorize_query_params_schema.parse(request.query)
    const client = await OAuthClient.findByPk(client_id, { rejectOnEmpty: new NullError("OAuth client not found.") })

    if (redirect_uri && !(await oauthModel.validateRedirectUri(redirect_uri, client))) {
      throw new createHttpError.BadRequest("Invalid redirect URI.")
    }

    response.status(200)
    response.json({
      status: response.statusCode,
      message: "OK",
      user: {
        name: request.user.preferred_name,
      },
      client: {
        name: client.name,
        redirect_uri: redirect_uri || client.redirectUris[0],
      },
    })
  }

  static authorizeOptions = {
    authenticateHandler: {
      handle: (request: Request & { user?: User }) => request.user,
    },
  }

  async postAuthorize(request: Request, response: Response, next: NextFunction) {
    const session = await getSession(request, response)
    session.redirect_to = undefined
    await session.commit()

    await this.provider.authorize(OAuthHandlers.authorizeOptions).call(this.provider, request, response, next)
  }

  static tokenOptions = {}

  async postToken(request: Request, response: Response, next: NextFunction) {
    await this.provider.token(OAuthHandlers.tokenOptions).call(this.provider, request, response, next)
  }
}

const handlersInstance = new OAuthHandlers(oauthProvider)
export default handlersInstance
