import ExpressOAuthServer from "@node-oauth/express-oauth-server";

import Model, { oauth_config } from "@/routes/auth/oauth/model";
import { NextFunction, Request, Response } from "express";
import OAuth2Server, {UnauthorizedRequestError} from "@node-oauth/oauth2-server";


declare class ExpressOAuthServer {
  _handleError(response: Response, oauthResponse: OAuth2Server.Response, error: Error, next: NextFunction): void;
}

class DurhackExpressOAuthServer extends ExpressOAuthServer {
  override authenticate(options?: OAuth2Server.AuthenticateOptions): (request: Request, response: Response, next: NextFunction) => Promise<OAuth2Server.Token> {
    const middleware = super.authenticate(options);

    return async function(request: Request, response: Response, next: NextFunction): Promise<OAuth2Server.Token> {
      const result = await middleware(request, response, next);

      if (typeof response.locals.oauth?.token === "object") {
        request.user = response.locals.oauth.token.user;
      }

      return result;
    };
  }

  override _handleError(response: Response, oauthResponse: OAuth2Server.Response, error: Error, next: NextFunction) {
    if (error instanceof UnauthorizedRequestError) {
      response.set(oauthResponse.headers);
      return next();
    }
    super._handleError(response, oauthResponse, error, next);
  }
}

const wrapped_oauth_provider = new DurhackExpressOAuthServer(
  {
    model: Model,
    accessTokenLifetime: oauth_config.accessTokenLifetime,
    refreshTokenLifetime: oauth_config.refreshTokenLifetime,
    allowEmptyState: true,
    allowExtendedTokenAttributes: true,
    useErrorHandler: true,
    continueMiddleware: false,
  }
);

export default wrapped_oauth_provider;
