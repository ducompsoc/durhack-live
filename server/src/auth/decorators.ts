import { NextFunction, Request, Response } from "express"
import OAuth2Server from "@node-oauth/oauth2-server"

import { UserRole } from "@/common/model_enums"

type ICondition = (request: Request, response: Response) => boolean

export function requireCondition(condition: ICondition) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return function (target: any, property_key: string, descriptor: PropertyDescriptor) {
    const old_function = descriptor.value

    async function wrapped_function(request: Request, response: Response, next: NextFunction) {
      if (!condition(request, response)) {
        return next()
      }
      return await old_function.apply(target, [request, response, next])
    }

    descriptor.value = wrapped_function
  }
}

export function userIsRole(role: UserRole) {
  return function (request: Request) {
    return request.user?.role === role
  }
}

export function userIsLoggedIn(request: Request) {
  return !!request.user
}

export function hasScope(scope: string | string[]) {
  return function (request: Request, response: Response) {
    if (!request.user) return false
    if (typeof response.locals.oauth?.token !== "object") return true

    const token = response.locals.oauth.token as OAuth2Server.Token
    let tokenScope = token.scope

    if (typeof scope === "string") {
      scope = [scope]
    }

    if (typeof tokenScope === "undefined") return false
    if (typeof tokenScope === "string") {
      tokenScope = [tokenScope]
    }

    return scope.every(element => tokenScope?.includes(element))
  }
}

export const requireUserIsAdmin = requireCondition(userIsRole(UserRole.admin))
export const requireLoggedIn = requireCondition(userIsLoggedIn)
export function requireScope(scope: string | string[]) {
  return requireCondition(hasScope(scope))
}
