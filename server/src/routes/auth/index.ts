import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware";
import { handleGetCsrfToken } from "@/auth/csrf";

import discord_router from "./discord";
import oauth_router from "./oauth";
import handlers from "./auth_handlers";


const auth_router = ExpressRouter();

auth_router.use("/discord", discord_router);
auth_router.use("/oauth", oauth_router);

auth_router.route("/login")
  .post(
    passport.authenticate("local", {
      failWithError: true,
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router.route("/check-verify")
  .post(handlers.handleCheckVerifyCode)
  .all(handleMethodNotAllowed);

auth_router.route("/check-email")
  .post(handlers.handleCheckEmail)
  .all(handleMethodNotAllowed);

auth_router.route("/verify-email")
  .post(handlers.handleVerifyEmail)
  .all(handleMethodNotAllowed);

auth_router.route("/set-password")
  .post(handlers.handleSetPassword,
    passport.authenticate("local", {
      failWithError: true,
    }),
    handlers.handleLoginSuccess)
  .all(handleMethodNotAllowed);

auth_router.route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed);

auth_router.route("/socket-token")
  .get(handlers.handleGetSocketToken, handleFailedAuthentication)
  .all(handleMethodNotAllowed);

export default auth_router;