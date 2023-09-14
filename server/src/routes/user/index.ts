import { NextFunction, Request, Response, Router as ExpressRouter } from "express";
import createHttpError from "http-errors";

import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware";

import handlers from "./user_handlers";


const user_router = ExpressRouter();

user_router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized();
  }

  next();
});

user_router.route("/")
  .get(handlers.getUserWithDetails, handlers.getUser)
  .patch(handlers.patchUserDetails, handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET", "PATCH"));

user_router.route("/check-in")
  .post(handlers.checkUserIn, handleFailedAuthentication)
  .all(handleMethodNotAllowed("POST"));

export default user_router;
