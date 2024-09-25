import { App, type NextFunction } from "@otterhttp/app"
import createHttpError from "http-errors"

import { handleFailedAuthentication, handleMethodNotAllowed } from "@/common/middleware"
import type { Request } from "@/request"
import type { Response } from "@/response"

import type { User } from "@/database"
import { userHandlers } from "./user-handlers"

const userApp = new App<Request, Response>()

userApp.use((request: Request & { user?: User }, response: Response, next: NextFunction) => {
  if (!request.user) {
    throw new createHttpError.Unauthorized()
  }

  next()
})

userApp.route("/").get(userHandlers.getUser()).all(handleMethodNotAllowed("GET"))

export { userApp }
