import { Router as ExpressRouter } from "express";
import passport from "passport";

import { doubleCsrfProtection, handleGetCsrfToken}  from "@/auth/csrf";
import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware";


import discord_router from "./discord";
import oauth_router from "./oauth";
import handlers from "./auth_handlers";
import config from "config";


const auth_router = ExpressRouter();

auth_router.use("/discord", discord_router);
auth_router.use("/oauth", oauth_router);

if (config.get("csrf.enabled")) {
  auth_router.use(doubleCsrfProtection);
}

auth_router.route("/login")
  .get(handlers.handleLoginSuccess)
  .post(
    passport.authenticate("local", {
      failWithError: true,
      keepSessionInfo: true,
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed("GET", "POST"));

auth_router.route("/check-verify")
  .post(handlers.handleCheckVerifyCode)
  .all(handleMethodNotAllowed("POST"));

auth_router.route("/check-email")
  .post(handlers.handleCheckEmail)
  .all(handleMethodNotAllowed("POST"));

auth_router.route("/verify-email")
  .post(handlers.handleVerifyEmail)
  .all(handleMethodNotAllowed("POST"));

auth_router.route("/set-password")
  .post(handlers.handleSetPassword,
    passport.authenticate("local", {
      failWithError: true,
      keepSessionInfo: true,
    }),
    handlers.handleLoginSuccess)
  .all(handleMethodNotAllowed("POST"));

auth_router.route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed("GET"));

auth_router.route("/socket-token")
  .get(handlers.handleGetSocketToken, handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET"));

export default auth_router;
