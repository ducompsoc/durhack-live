import type { Token } from "@node-oauth/oauth2-server"
import type { NextFunction, Request, Response } from "@tinyhttp/app"

import { UserRole } from "@/common/model-enums"
import type { User } from "@/database/tables"

type ICondition = (request: Request, response: Response) => boolean

export function requireCondition(condition: ICondition) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (target: unknown, property_key: string, descriptor: PropertyDescriptor) => {
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
  return (request: Request & { user?: User }) => request.user?.role === role
}

export function userIsLoggedIn(request: Request & { user?: User }) {
  return !!request.user
}

export function hasScope(scope: string | string[]) {
  return (request: Request & { user?: User }, response: Response) => {
    if (!request.user) return false
    if (typeof response.locals.oauth?.token !== "object") return true

    const token = response.locals.oauth.token as Token
    const tokenScope = token.scope

    if (typeof tokenScope === "undefined") return false
    if (typeof scope === "string") {
      return tokenScope.includes(scope)
    }

    return scope.every((element) => tokenScope?.includes(element))
  }
}

export const requireUserIsAdmin = requireCondition(userIsRole(UserRole.admin))
export const requireLoggedIn = requireCondition(userIsLoggedIn)
export function requireScope(scope: string | string[]) {
  return requireCondition(hasScope(scope))
}
