import type { Token } from "@node-oauth/oauth2-server"
import type { NextFunction } from "@otterhttp/app"

import { adaptTokenSetToClient } from "@/auth/adapt-token-set"
import { type User, prisma } from "@/database"
import type { Request } from "@/request"
import type { Response } from "@/response"
import type { Middleware } from "@/types/middleware"
import createHttpError from "http-errors"

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

export function userHasRole(role: string): Condition {
  return async (request: Request & { user?: User }): Promise<boolean> => {
    if (request.user == null) return false
    const prismaTokenSet = await prisma.tokenSet.findUnique({
      where: {
        userId: request.user.keycloakUserId,
      },
    })
    if (prismaTokenSet == null) throw new createHttpError.InternalServerError()
    const tokenSet = adaptTokenSetToClient(prismaTokenSet)
    const { groups } = tokenSet.claims()
    if (groups == null || !Array.isArray(groups)) return false
    return groups.includes(role)
  }
}

export function userIsLoggedIn(): Condition {
  return (request: Request & { user?: User }) => request.user != null
}

export function hasScope(scope: string | string[]): Condition {
  return (request: Request & { user?: User }, response: Response & { locals: { oauth?: { token: Token } } }) => {
    if (!request.user) return false
    if (typeof response.locals.oauth?.token !== "object") return true

    const token = response.locals.oauth.token
    const tokenScope = token.scope

    if (typeof tokenScope === "undefined") return false
    if (typeof scope === "string") {
      return tokenScope.includes(scope)
    }

    return scope.every((element) => tokenScope?.includes(element))
  }
}

export function requireRole(role: string) {
  return requireCondition(userHasRole(role))
}
export function requireLoggedIn() {
  return requireCondition(userIsLoggedIn())
}
export function requireScope(scope: string | string[]) {
  return requireCondition(hasScope(scope))
}
