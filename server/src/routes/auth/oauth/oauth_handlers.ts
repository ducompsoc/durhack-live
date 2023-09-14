import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AccessDeniedError } from "@node-oauth/oauth2-server";
import { stringify as qs_stringify } from "qs";

import { OAuthClient } from "@/database/tables";
import { NullError } from "@/common/errors";

import OAuthModel from "./model";
import wrapped_oauth_provider, { DurhackExpressOAuthServer } from "./wrapper";
import createHttpError from "http-errors";


class OAuthHandlers {
  provider: DurhackExpressOAuthServer;

  constructor(provider: DurhackExpressOAuthServer) {
    this.provider = provider;

    Object.getOwnPropertyNames(OAuthHandlers.prototype).forEach((key) => {
      if (key !== "constructor") {
        this[key] = this[key].bind(this);
      }
    });
  }

  static get_authorize_query_params_schema = z.object({
    client_id: z.string(),
    redirect_uri: z.string().url().optional(),
  });

  async getAuthorize(request: Request, response: Response) {
    if (!request.user) {
      request.session.redirect_to = "/login/authorize?" + qs_stringify(request.query);
      response.redirect("/login");
      // we have to save session manually - as we redirect, save() is not called automatically
      request.session.save();
      return;
    }

    const { client_id, redirect_uri } = OAuthHandlers.get_authorize_query_params_schema.parse(request.query);
    const client = await OAuthClient.findByPk(client_id, { rejectOnEmpty: new NullError("OAuth client not found.") });

    if (redirect_uri && !await OAuthModel.validateRedirectUri(redirect_uri, client)) {
      throw new createHttpError.BadRequest("Invalid redirect URI.");
    }

    response.status(200);
    response.json({
      status: response.statusCode,
      message: "OK",
      user: {
        name: request.user.preferred_name,
      },
      client: {
        name: client.name,
        redirect_uri: redirect_uri || client.redirectUris[0],
      }
    });
  }

  static authorizeOptions = {
    authenticateHandler: {
      handle: (request: Request) => request.user,
    }
  };

  async postAuthorize(request: Request, response: Response, next: NextFunction) {
    return await this.provider.authorize(OAuthHandlers.authorizeOptions).call(this.provider, request, response, next);
  }

  static tokenOptions = {};

  async postToken(request: Request, response: Response, next: NextFunction) {
    return await this.provider.token(OAuthHandlers.tokenOptions).call(this.provider, request, response, next);
  }
}

const handlersInstance = new OAuthHandlers(wrapped_oauth_provider);
export default handlersInstance;
