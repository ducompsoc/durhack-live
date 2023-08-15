import { Router as ExpressRouter } from "express";
import passport from "passport";

import { handleMethodNotAllowed } from "@/common/middleware";
import { handleGetCsrfToken } from "@/auth/csrf";

import handlers from "./auth_handlers";

const auth_router = ExpressRouter();

auth_router.route("/login")
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureMessage: true
    }),
    handlers.handleLoginSuccess
  )
  .all(handleMethodNotAllowed);

auth_router.route("/sign-up")
  .post(handlers.handleSignUp)
  .all(handleMethodNotAllowed);

auth_router.route("/set-password")
  .post(handlers.handleSetPassword)
  .all(handleMethodNotAllowed);

auth_router.route("/csrf-token")
  .get(handleGetCsrfToken)
  .all(handleMethodNotAllowed);

export default auth_router;