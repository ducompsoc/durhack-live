import type { Token } from "@node-oauth/oauth2-server"
import type { NextFunction, Request, Response } from "@tinyhttp/app"

import { UserRole } from "@/common/model-enums"
import type { User } from "@/database"
import type { Middleware } from "@/types/middleware"

type Condition = (request: Request, response: Response) => boolean | Promise<boolean>

/**
 * Factory that creates a TypeScript decorator for a condition.
 * Decorated methods are expected to return a middleware function;
 * the decorated function will return the same middleware that will execute
 * only if the condition evaluates true. If the condition evaluates false, the
 * middleware will invoke next() and terminate.
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
        const evaluatedCondition = await condition(request, response)
        if (!evaluatedCondition) {
          next()
          return
        }
        await middleware.call(value, request, response, next)
      }
    }
  }
}

export function userIsRole(role: UserRole) {
  return (request: Request & { user?: User }) => {
    throw new Error("Not implemented.")
  }
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
