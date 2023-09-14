import ExpressOAuthServer from "@node-oauth/express-oauth-server";

import Model, { oauth_config } from "@/routes/auth/oauth/model";
import { NextFunction, Request, Response } from "express";
import OAuth2Server, {AccessDeniedError, UnauthorizedRequestError} from "@node-oauth/oauth2-server";


declare class ExpressOAuthServer {
  _handleError(response: Response, oauthResponse: OAuth2Server.Response, error: Error, next: NextFunction): void;
}

export class DurhackExpressOAuthServer extends ExpressOAuthServer {

  copyUserFromOAuthToken(request: Request, response: Response, next: NextFunction) {
    if (typeof response.locals.oauth === "object") {
      request["user"] = response.locals.oauth.token.user;
    }
    return next();
  }

  override _handleError(response: Response, oauthResponse: OAuth2Server.Response, error: Error, next: NextFunction) {
    if (error instanceof UnauthorizedRequestError) {
      response.setHeader("WWW-Authenticate", 'Bearer realm="Service"');
      return next();
    }
    if (error instanceof AccessDeniedError) {
      return this._handleResponse(null, response, oauthResponse);
    }
    super._handleError(response, oauthResponse, error, next);
  }

  override _handleResponse(request: Request | null, response: Response, oauthResponse: OAuth2Server.Response) {
    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers!.location;
      delete oauthResponse.headers!.location;
      response.set(oauthResponse.headers!);
      response.redirect(200, location);
      return;
    }
    response.set(oauthResponse.headers);
    response.status(oauthResponse.status || 500).send(oauthResponse.body);
  }
}

const wrapped_oauth_provider = new DurhackExpressOAuthServer(
  {
    model: Model,
    ...oauth_config,
  }
);

export default wrapped_oauth_provider;
