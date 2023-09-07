import { Request, Response, Router as ExpressRouter} from "express";
import { z } from "zod";

import { handleMethodNotAllowed } from "@/common/middleware";
import wrapped_oauth_provider from "@/routes/auth/oauth/wrapper";
import { OAuthClient } from "@/database/tables";
import {NullError} from "@/common/errors";


const authorize_get_query_params = z.object({
  client_id: z.string(),
});


const oauth_router = ExpressRouter();

oauth_router.route("/authorize")
  .get(async (request: Request, response: Response) => {
    if (!request.user) {
      request.session.redirect_to = "/login/authorize" + new URL(request.originalUrl).search;
      response.redirect("/login");
      return;
    }

    const { client_id } = authorize_get_query_params.parse(request.query);
    const client = await OAuthClient.findByPk(client_id, { rejectOnEmpty: new NullError("OAuth client not found.") });

    response.status(200);
    response.json({
      status: response.statusCode,
      message: "OK",
      user: {
        name: request.user.preferred_name,
      },
      client:{
        name: client.name,
      }
    });
  })
  .post(wrapped_oauth_provider.authorize({
    authenticateHandler: {
      handle: (request: Request) => request.user,
    }
  }))
  .all(handleMethodNotAllowed);

oauth_router.route("/token")
  .post(wrapped_oauth_provider.token())
  .all(handleMethodNotAllowed);


export default oauth_router;
