import config from "config";
import { Router as ExpressRouter, Request, Response } from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import createHttpError from "http-errors";
import cookie_parser from "cookie-parser";
import passport from "passport";

import { handleMethodNotAllowed } from "@/common/middleware";
import { doubleCsrfProtection } from "@/auth/csrf";
import wrapped_oauth_provider from "@/routes/auth/oauth/wrapper";

import auth_router from "./auth";
import users_router from "./users";
import api_error_handler from "./error_handling";


const api_router = ExpressRouter();

api_router.use(bodyParser.json());
api_router.use(bodyParser.urlencoded({ extended: true }));

api_router.use(passport.authenticate("session"));
api_router.use(wrapped_oauth_provider.authenticate({
  scope: [ "api" ]
}));


api_router.use(cookie_parser(config.get("cookie-parser.secret")));
if (config.get("csrf.enabled")) {
  api_router.use(doubleCsrfProtection);
}

function handle_root_request(request: Request, response: Response) {
  response.status(200);
  response.json({"status": response.statusCode, "message": "OK", "api_version": 1});
}

function handle_unhandled_request() {
  throw new createHttpError.NotFound("Unknown API route.");
}

api_router.route("/")
  .get(handle_root_request)
  .all(handleMethodNotAllowed);

api_router.use("/auth", auth_router);
api_router.use("/users", users_router);

api_router.use(handle_unhandled_request);

api_router.use(methodOverride());
api_router.use(api_error_handler);

export default api_router;
