import config from "config";
import { z } from "zod";
import { Request, Response } from "express";
import createHttpError from "http-errors";

import { hashPasswordText, randomBytesAsync } from "@/auth/strategy/local/util";
import { NullError } from "@/common/errors";
import MailgunClient from "@/common/mailgun";
import { sendStandardResponse } from "@/common/response";
import User from "@/database/user";


export default class AuthHandlers {
  private static ensureCorrectVerifyCode(user: User, verify_code_attempt: string): void {
    if (config.get("flags.skipEmailVerification") === "true") {
      return;
    }

    if (user.verify_code === null || user.verify_sent_at === null) {
      throw new createHttpError.BadRequest("Verify code not set.");
    }

    // verification codes are valid for 15 minutes (in milliseconds)
    if ((new Date().valueOf() - user.verify_sent_at.valueOf()) > 900_000) {
      throw new createHttpError.BadRequest("Verify code expired.");
    }

    if (user.verify_code !== verify_code_attempt) {
      throw new createHttpError.BadRequest("Verify code incorrect.");
    }
  }

  static async handleLoginSuccess(request: Request, response: Response) {
    if (!request.user) throw new Error();

    if (!request.user.checkedIn) {
      return response.redirect("/login/check-in");
    }

    return response.redirect("/event");
  }

  static sign_up_payload_schema = z.object({
    email: z.string().email(),
  });

  static async handleSignUp(request: Request, response: Response) {
    const { email } = AuthHandlers.sign_up_payload_schema.parse(request.body);

    const user = await User.findOneByEmail(email, new NullError("Email address not recognised."));

    const token = (await randomBytesAsync(3)).toString("hex").toUpperCase();

    await user.update({
      verifyCode: token,
      verifySentAt: new Date(),
    });

    const domain = config.get("mailgun.domain");

    if (typeof domain !== "string") {
      throw new Error("Mailgun domain incorrectly configured");
    }

    try {
      await MailgunClient.messages.create(domain, {
        from: `DurHack <noreply@${domain}>`,
        "h:Reply-To": "hello@durhack.com",
        to: user.email,
        subject: `Your DurHack verification code is ${user.verify_code}`,
        text: [
          `Hi ${user.preferredName},`,
          `Welcome to DurHack! Your verification code is ${user.verify_code}`,
          "If you have any questions, please chat to one of us.",
          "Thanks,",
          "The DurHack Team",
          "(If you didn't request this code, you can safely ignore this email.)",
        ].join("\n\n"),
      });
    } catch (error) {
      if (error instanceof Error) {
        Error.captureStackTrace(error);
        console.error(error.stack);
      }
      throw createHttpError.BadGateway("Failed to send verification email.");
    }

    return sendStandardResponse(response, 200, "Verification email sent.");
  }

  static set_password_schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    verify_code: z.string().length(6)
  });

  static async handleSetPassword(request: Request, response: Response) {
    const { email, password, verify_code } = AuthHandlers.set_password_schema.parse(request.body);

    const found_user = await User.findOneByEmail(email, new NullError(
      `It looks like you didn't fill in the sign-up form - try another email \
      address, or speak to a DurHack volunteer if you believe this is an error!`
    ));

    AuthHandlers.ensureCorrectVerifyCode(found_user, verify_code);

    const password_salt = await randomBytesAsync(16);
    found_user.hashed_password = await hashPasswordText(password, password_salt);
    found_user.password_salt = password_salt;

    await found_user.save();

    sendStandardResponse(response, 200);
  }
}
