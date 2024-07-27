import NodeOAuthServer, {
  type ServerOptions,
  InvalidArgumentError,
  Request,
  Response,
  UnauthorizedRequestError,
  AccessDeniedError,
} from "@node-oauth/oauth2-server"
import type { NextFunction, Request as TinyHttpRequest, Response as TinyHttpResponse } from "@tinyhttp/app"

import { oauthConfig } from "@/config"
import type { User } from "@/database"

import { oauthModel } from "./model"

type TinyHttpMiddleware = (
  request: TinyHttpRequest & { user?: User },
  res: TinyHttpResponse,
  next: NextFunction,
) => void | Promise<void>

export type TinyHttpOAuthServerOptions = ServerOptions

class TinyHttpOAuthServer {
  server: NodeOAuthServer

  /**
   * Creates a new OAuth2 server that will be bound to this class' middlewares.
   * Constructor takes several options as arguments.
   * The following describes only options, specific to this module.
   * For all other options, please read the docs from `@node-oauth/oauth2-server`:
   * @see https://node-oauthoauth2-server.readthedocs.io/en/master/api/oauth2-server.html
   */
  constructor(options: TinyHttpOAuthServerOptions) {
    if (!options.model) {
      throw new InvalidArgumentError("Missing parameter: `model`")
    }

    this.server = new NodeOAuthServer(options)
  }

  /**
   * Authentication Middleware.
   * Returns a middleware that will validate a token.
   *
   * @param options will be passed to the authenticate-handler as options, see linked docs
   * @see https://node-oauthoauth2-server.readthedocs.io/en/master/api/oauth2-server.html#authenticate-request-response-options
   * @see https://tools.ietf.org/html/rfc6749#section-7
   */
  authenticate(options: NodeOAuthServer.AuthenticateOptions): TinyHttpMiddleware {
    return async (req, res, next) => {
      const request = new Request(req)
      const response = new Response(res)

      let token: NodeOAuthServer.Token

      try {
        token = await this.server.authenticate(request, response, options)
      } catch (error) {
        if (error instanceof UnauthorizedRequestError) {
          res.setHeader("WWW-Authenticate", 'Bearer realm="Service"')
          return next()
        }

        if (error instanceof AccessDeniedError) {
          return this.handleResponse(req, res, response)
        }
        throw error
      }

      res.locals.oauth = { token }
      req.user = token.user as User
      next()
    }
  }

  /**
   * Authorization Middleware.
   * Returns a middleware that will authorize a client to request tokens.
   *
   * @param options will be passed to the authorize-handler as options, see linked docs
   * @see https://node-oauthoauth2-server.readthedocs.io/en/master/api/oauth2-server.html#authorize-request-response-options
   * @see https://tools.ietf.org/html/rfc6749#section-3.1
   */
  authorize(options: NodeOAuthServer.AuthorizeOptions): TinyHttpMiddleware {
    return async (req, res, next) => {
      const request = new Request(req)
      const response = new Response(res)

      await this.server.authorize(request, response, options)

      return this.handleResponse(req, res, response)
    }
  }

  /**
   * Grant Middleware.
   * Returns middleware that will grant tokens to valid requests.
   *
   * @param options will be passed to the token-handler as options, see linked docs
   * @see https://node-oauthoauth2-server.readthedocs.io/en/master/api/oauth2-server.html#token-request-response-options
   * @see https://tools.ietf.org/html/rfc6749#section-3.2
   */
  token(options: NodeOAuthServer.TokenOptions): TinyHttpMiddleware {
    return async (req, res, next) => {
      const request = new Request(req)
      const response = new Response(res)

      await this.server.token(request, response, options)
      return this.handleResponse(req, res, response)
    }
  }

  /**
   * Handle response.
   */
  private handleResponse(req: TinyHttpRequest, res: TinyHttpResponse, response: Response): void {
    if (response.status === 302 && response.headers?.location != null) {
      const { location, ...headers } = response.headers
      res.set(headers)
      res.redirect(location)
      return
    }

    res.set(response.headers ?? {})
    res.status(response.status ?? 500).send(response.body)
  }
}

const oauthProvider = new TinyHttpOAuthServer({
  model: oauthModel,
  ...oauthConfig,
})

export { oauthProvider, TinyHttpOAuthServer }
