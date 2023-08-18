import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleMethodNotAllowed } from "@/common/middleware";
import { handleGetCsrfToken } from "@/auth/csrf";

import discord_router from "./discord";
import handlers from "./auth_handlers";

const auth_router = ExpressRouter();

auth_router.use("/discord", discord_router);

auth_router.route("/login")
  .post(
    passport.authenticate("local", {
      failWithError: true,
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router.route("/check-email")
  .post(handlers.handleCheckEmail)
  .all(handleMethodNotAllowed);

auth_router.route("/sign-up")
  .post(handlers.handleSignUp)
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

export default auth_router;