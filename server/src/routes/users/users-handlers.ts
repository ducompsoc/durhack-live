import type { Request, Response } from "@otterhttp/app"
import createHttpError from "http-errors"

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
