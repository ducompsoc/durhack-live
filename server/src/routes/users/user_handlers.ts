import { Request, Response } from "express";
import pick from "lodash/pick";
import { z } from "zod";

import { requireSelf } from "@/routes/users/user_util";
import { Ethnicity, Gender } from "@/common/model_enums";
import User from "@/database/tables/user";

export default class UserHandlers {
  private static pickPayloadFields(user: User) {
    return pick(user, "age", "phone_number", "university", "graduation_year", "ethnicity", "gender", "h_UK_consent", "h_UK_marketing", "checked_in");
  }

  @requireSelf
  static async getSelfDetails(request: Request, response: Response) {
    if (!request.user) throw new Error();
    const payload = UserHandlers.pickPayloadFields(request.user);
    response.status(200);
    response.json({ status: response.statusCode, message: "OK", data: payload });
  }

  static abstract_patch_payload = z.object({
    age: z.number().min(18),
    phone_number: z.string().regex(/^\+?(\d|\s)+$/),
    university: z.string(),
    graduation_year: z.number().min(2020).max(2030),
    ethnicity: z.nativeEnum(Ethnicity).optional(),
    gender: z.nativeEnum(Gender).optional(),
    h_UK_consent: z.boolean(),
    h_UK_marketing: z.boolean(),
  });
  static abstract_checkin_flag = z.object({
    checked_in: z.literal(true)
  });
  static check_in_payload = this.abstract_patch_payload.merge(this.abstract_checkin_flag);
  static update_details_payload = this.abstract_patch_payload.partial();
  static patch_payload = z.union([this.check_in_payload, this.update_details_payload]);

  @requireSelf
  static async patchSelfDetails(request: Request, response: Response) {
    if (!request.user) throw new Error();
    const fields_to_update = UserHandlers.patch_payload.parse(request.body);
    await request.user.update(fields_to_update);

    const payload = UserHandlers.pickPayloadFields(request.user);
    response.status(200);
    response.json({ status: response.statusCode, message: "OK", data: payload });
  }
}