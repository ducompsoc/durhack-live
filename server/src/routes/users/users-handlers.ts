import type { Request, Response } from "@tinyhttp/app"
import createHttpError from "http-errors"

import User from "@/database/tables/user"
import type { Middleware } from "@/types/middleware"

export class UsersHandlers {
  getUsersList(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  createUser(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  getUserDetails(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  patchUserDetails(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }

  deleteUser(): Middleware {
    return (request: Request, response: Response) => {
      throw new createHttpError.NotImplemented()
    }
  }
}

export const usersHandlers = new UsersHandlers()
