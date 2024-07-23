import { Request, Response } from "@tinyhttp/app"
import createHttpError from "http-errors"

import User from "@/database/tables/user"

export default class UsersHandlers {
  static getUsersList(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static createUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static getUserDetails(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static patchUserDetails(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }

  static deleteUser(request: Request, response: Response) {
    throw new createHttpError.NotImplemented()
  }
}
