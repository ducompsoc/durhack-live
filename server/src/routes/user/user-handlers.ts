import createHttpError from "http-errors"
import { default as pick } from "lodash/pick.js"
import type { UserinfoResponse } from "openid-client"
import { z } from "zod"

import { adaptTokenSetToClient } from "@/auth/adapt-token-set"
import { requireScope } from "@/auth/decorators"
import { Ethnicity, Gender } from "@/common/model-enums"
import { type User, prisma } from "@/database"
import type { Request } from "@/request"
import type { Response } from "@/response"
import { keycloakClient } from "@/routes/auth/keycloak/keycloak-client"
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

  private static pickUserWithDetailsFields(profile: UserinfoResponse) {
    return { email: profile.email }
  }

  private static pickIdentifyingFields(profile: UserinfoResponse) {
    return { email: profile.email }
  }

  @requireScope("api:user.details")
  getUserWithDetails(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      const profile = await UserHandlers.getUserProfile(request.user)
      const payload = UserHandlers.pickUserWithDetailsFields(profile)
      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
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

  static abstract_patch_payload = z.object({
    age: z.number().min(18),
    phone_number: z.string().regex(/^\+?(\d|\s)+$/),
    university: z.string(),
    graduation_year: z.number().min(2020).max(2030),
    ethnicity: z.nativeEnum(Ethnicity).default(Ethnicity.pnts),
    gender: z.nativeEnum(Gender).default(Gender.pnts),
    h_UK_consent: z.boolean(),
    h_UK_marketing: z.boolean(),
  })
  static check_in_payload = this.abstract_patch_payload.extend({
    checked_in: z.literal(true),
  })
  static update_details_payload = this.abstract_patch_payload.partial()

  @requireScope("api:user.details.write")
  patchUserDetails(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      const fields_to_update = UserHandlers.update_details_payload.parse(request.body)

      // todo: keycloak API call to apply patches

      const profile = await UserHandlers.getUserProfile(request.user)
      const payload = UserHandlers.pickUserWithDetailsFields(profile)
      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
  }

  @requireScope("api:user.details.write")
  checkUserIn(): Middleware {
    return async (request: Request & { user?: User }, response: Response) => {
      if (request.user == null) throw createHttpError(500)
      const fields_to_update = UserHandlers.check_in_payload.parse(request.body)

      // todo: keycloak API call to apply patches

      const profile = await UserHandlers.getUserProfile(request.user)
      const payload = UserHandlers.pickUserWithDetailsFields(profile)
      response.status(200)
      response.json({ status: response.statusCode, message: "OK", data: payload })
    }
  }
}

export const userHandlers = new UserHandlers()
