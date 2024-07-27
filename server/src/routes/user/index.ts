import { App, type NextFunction, type Request, type Response } from "@tinyhttp/app"
import createHttpError from "http-errors"

import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"

import type { User } from "@/database"
import { userHandlers } from "./user-handlers"

const userApp = new App()

userApp.use((request: Request & { user?: User }, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

userApp
  .route("/")
  .get(userHandlers.getUserWithDetails())
  .get(userHandlers.getUser())
  .patch(userHandlers.patchUserDetails(), handleFailedAuthentication)
  .all(handleMethodNotAllowed("GET", "PATCH"))

userApp
  .route("/check-in")
  .post(userHandlers.checkUserIn(), handleFailedAuthentication)
  .all(handleMethodNotAllowed("POST"))

export { userApp }
