import { Request, Response } from "express"
import pick from "lodash/pick"
import { z } from "zod"

import { requireScope } from "@/auth/decorators"
import { Ethnicity, Gender } from "@/common/model_enums"
import User from "@/database/tables/user"

export default class UserHandlers {
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
  static async getUserWithDetails(request: Request, response: Response) {
    const payload = UserHandlers.pickUserWithDetailsFields(request.user!)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  static async getUser(request: Request, response: Response) {
    const payload = UserHandlers.pickIdentifyingFields(request.user!)
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
  static async patchUserDetails(request: Request, response: Response) {
    const fields_to_update = UserHandlers.update_details_payload.parse(request.body)
    await request.user!.update(fields_to_update)

    const payload = UserHandlers.pickUserWithDetailsFields(request.user!)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }

  @requireScope("api:user.details.write")
  static async checkUserIn(request: Request, response: Response) {
    const fields_to_update = UserHandlers.check_in_payload.parse(request.body)
    await request.user!.update(fields_to_update)

    const payload = UserHandlers.pickUserWithDetailsFields(request.user!)
    response.status(200)
    response.json({ status: response.statusCode, message: "OK", data: payload })
  }
}
