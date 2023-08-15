import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { requireCondition } from "@/auth/decorators";

export function useSelfId(request: Request, response: Response, next: NextFunction): void {
  if (!request.user) {
    throw new createHttpError.Unauthorized();
  }

  response.locals.user_id = request.user.id;
  next();
}

export function userIsSelf(request: Request, response: Response): boolean {
  return (!!request.user && request.user.id === response.locals.user_id);
}

export const requireSelf = requireCondition(userIsSelf)