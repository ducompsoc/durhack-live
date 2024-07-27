import type { Token } from "@node-oauth/oauth2-server"
import type { NextFunction, Request, Response } from "@tinyhttp/app"

import { UserRole } from "@/common/model-enums"
import type { User } from "@/database/tables"
import type { Middleware } from "@/types/middleware"

type Condition = (request: Request, response: Response) => boolean

/**
 * Factory that creates a TypeScript decorator for a condition.
 *
 * Decorated methods are expected to return a middleware function. The returned middleware will be decorated
 *
 *
 * @param condition
 */
export function requireCondition(condition: Condition) {
  return (
    value: (this: unknown, ...rest: unknown[]) => Middleware,
    _: {
      kind: "method"
    },
  ) => {
    return function wrapped_function(this: unknown, ...args: unknown[]): Middleware {
      const middleware: Middleware = value.call(this, ...args)

      return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        if (!condition(request, response)) {
          next()
          return
        }
        await middleware.call(value, request, response, next)
      }
    }
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
