import type { Request, Response } from "@tinyhttp/app"
import { default as pick } from "lodash/pick.js"
import { z } from "zod"

import { requireScope } from "@/auth/decorators"
import { Ethnicity, Gender } from "@/common/model-enums"
import type User from "@/database/tables/user"
import createHttpError from "http-errors"

export class UserHandlers {
  private static pickUserWithDetailsFields(user: User) {
    return pick(
      user,
      "email",
      "preferred_name",
      "role",
      "age",
      "phone_number",
      "university",
      "graduation_year",
      "ethnicity",
      "gender",
      "h_UK_consent",
      "h_UK_marketing",
      "checked_in",
    )
  }

  private static pickIdentifyingFields(user: User) {
    return pick(user, "email", "preferred_name", "role")
  }

  @requireScope("api:user.details")
  async getUserWithDetails(request: Request & { user?: User }, response: Response) {
    if (request.user == null) throw createHttpError(500)
    const payload = UserHandlers.pickUserWithDetailsFields(request.user)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  async getUser(request: Request & { user?: User }, response: Response) {
    if (request.user == null) throw createHttpError(500)
    const payload = UserHandlers.pickIdentifyingFields(request.user)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
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
  async patchUserDetails(request: Request & { user?: User }, response: Response) {
    if (request.user == null) throw createHttpError(500)
    const fields_to_update = UserHandlers.update_details_payload.parse(request.body)
    await request.user.update(fields_to_update)

    const payload = UserHandlers.pickUserWithDetailsFields(request.user)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  @requireScope("api:user.details.write")
  async checkUserIn(request: Request & { user?: User }, response: Response) {
    if (request.user == null) throw createHttpError(500)
    const fields_to_update = UserHandlers.check_in_payload.parse(request.body)
    await request.user.update(fields_to_update)

    const payload = UserHandlers.pickUserWithDetailsFields(request.user)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }
}

export const userHandlers = new UserHandlers()
