import createHttpError from "http-errors"
import type { UserinfoResponse } from "openid-client"

import { adaptTokenSetToClient } from "@/auth/adapt-token-set"
import { keycloakClient } from "@/auth/keycloak-client"
import { type User, prisma } from "@/database"
import type { Request } from "@/request"
import type { Response } from "@/response"
import type { Middleware } from "@/types/middleware"

export class UserHandlers {
  private static async getUserProfile(user: User) {
    const prismaTokenSet = await prisma.tokenSet.findUnique({
      where: {
        userId: user.keycloakUserId,
      },
    })
    if (prismaTokenSet == null) throw new createHttpError.InternalServerError()
    const tokenSet = adaptTokenSetToClient(prismaTokenSet)
    return await keycloakClient.userinfo(tokenSet)
  }

  private static pickIdentifyingFields(profile: UserinfoResponse) {
    return { email: profile.email }
  }

  getUser(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      const profile = await UserHandlers.getUserProfile(request.user)
      const payload = UserHandlers.pickIdentifyingFields(profile)
      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
  }
}

export const userHandlers = new UserHandlers()
