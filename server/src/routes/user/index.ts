import { NextFunction, Request, Response, App } from "@tinyhttp/app"
import createHttpError from "http-errors"

import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"

import handlers from "./user_handlers"
import { User } from "@/database/tables";

const userApp = new App()

userApp.use((request: Request & { user?: User }, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

userApp
  .route("/")
  .get(handlers.getUserWithDetails)
  .get(handlers.getUserWithDetails, handlers.getUser)
  .patch(handlers.patchUserDetails, handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET", "PATCH"))

userApp
  .route("/check-in")
  .post(handlers.checkUserIn, handleFailedAuthentication)
  .all(handleMethodNotAllowed("POST"))

export { userApp }
