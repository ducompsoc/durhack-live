import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

import User from "@/database/user";
import { requireSelf } from "@/routes/users/user_util";

export default class UserHandlers {
  @requireSelf
  static async getSelfDetails(request: Request, response: Response, next: NextFunction) {
    throw new createHttpError.NotImplemented();
  }

  @requireSelf
  static async patchSelfDetails(request: Request, response: Response, next: NextFunction) {
    throw new createHttpError.NotImplemented();
  }
}