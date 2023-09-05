import { Router as ExpressRouter } from "express";
import OAuth2Server from "@node-oauth/oauth2-server";

import { handleMethodNotAllowed, handleNotImplemented } from "@/common/middleware";

import Model, { oauth_config } from "./model";
import OAuthClient from "../../../database/tables/oauth_client";

const oauth_router = ExpressRouter();

const oauth_provider = new OAuth2Server({
  model: Model,
  grants: oauth_config.grants,
  accessTokenLifetime: oauth_config.accessTokenLifetime,
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
});

oauth_router.route("/authorize")
  .get(handleNotImplemented)
  .post(handleNotImplemented)
  .all(handleMethodNotAllowed);


oauth_router.route("/token")
  .post(handleNotImplemented)
  .all(handleMethodNotAllowed);


export default oauth_router;