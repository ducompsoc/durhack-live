import { NextFunction, Request, Response } from "express";
import { UserRole } from "@/common/model_enums";

type ICondition = (request: Request, response: Response) => boolean;

export function requireCondition(condition: ICondition) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return function (target: any, property_key: string, descriptor: PropertyDescriptor) {
    const old_function = descriptor.value;

    async function wrapped_function (request: Request, response: Response, next: NextFunction) {
      if (!condition(request, response)) {
        return next();
      }
      return await old_function.apply(target, [request, response, next]);
    }

    descriptor.value = wrapped_function;
  };
}

export function userIsRole(role: UserRole) {
  return function(request: Request) {
    return request.user?.role === role;
  };
}

export function userIsLoggedIn(request: Request) {
  return !!request.user;
}

export const requireUserIsAdmin = requireCondition(userIsRole(UserRole.admin));
export const requireLoggedIn = requireCondition(userIsLoggedIn);
