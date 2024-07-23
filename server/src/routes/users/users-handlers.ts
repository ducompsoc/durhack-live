import type { Request, Response } from "@tinyhttp/app"
import createHttpError from "http-errors"

import User from "@/database/tables/user"

export class UsersHandlers {
  getUsersList(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  createUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  getUserDetails(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  patchUserDetails(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  deleteUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }
}

export const usersHandlers = new UsersHandlers()
