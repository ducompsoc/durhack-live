import config from "config";
import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { requireLoggedIn } from "@/auth/decorators";
import { hashPasswordText, randomBytesAsync } from "@/auth/strategy/local/util";
import TokenVault from "@/auth/strategy/bearer/util";
import { NullError } from "@/common/errors";
import MailgunClient from "@/common/mailgun";
import { sendStandardResponse } from "@/common/response";
import User from "@/database/user";


export default class AuthHandlers {
  static check_email_schema = z.object({
    email: z.string().email(),
  });

  static async handleCheckEmail(request: Request, response: Response) {
    const { email } = AuthHandlers.check_email_schema.parse(request.body);
    const result = await User.findOneByEmail(email, new NullError("Email isn't associated with any user."));
    const payload = { exists: true, password_set: result.hashed_password !== null };
    response.status(200);
    response.json({ status: response.statusCode, message: "OK", data: payload });
  }

  static check_verify_code_schema = z.object({
    email: z.string().email(),
    verify_code: z.string().length(6),
  });

  static async handleCheckVerifyCode(request: Request, response: Response) {
    const { email, verify_code } = AuthHandlers.check_verify_code_schema.parse(request.body);
    const found_user = await User.findOneByEmail(email, new NullError());
    AuthHandlers.ensureCorrectVerifyCode(found_user, verify_code);
    sendStandardResponse(response, 200);
  }

  private static verifyCodeExpired(user: User): boolean {
    return (new Date().valueOf() - user.verify_sent_at!.valueOf()) > 900_000;
  }

  private static ensureCorrectVerifyCode(user: User, verify_code_attempt: string): void {
    if (config.get("flags.skipEmailVerification") === true) {
      return;
    }

    if (!user.verify_code || !user.verify_sent_at) {
      throw new createHttpError.Conflict("Verify code not set.");
    }

    // verification codes are valid for 15 minutes (in milliseconds)
    if (AuthHandlers.verifyCodeExpired(user)) {
      throw new createHttpError.BadRequest("Verify code expired.");
    }

    if (user.verify_code !== verify_code_attempt) {
      throw new createHttpError.BadRequest("Verify code incorrect.");
    }
  }

  static async handleLoginSuccess(request: Request, response: Response) {
    if (!request.user) throw new Error();

    return sendStandardResponse(response, 200);
  }

  private static async sendVerifyCode(user: User) {
    const token = (await randomBytesAsync(3)).toString("hex").toUpperCase();

    await user.update({
      verify_code: token,
      verify_sent_at: new Date(),
    });

    const domain = config.get("mailgun.domain");

    if (typeof domain !== "string") {
      throw new Error("Mailgun domain incorrectly configured");
    }

    await MailgunClient.messages.create(domain, {
      from: `DurHack <noreply@${domain}>`,
      "h:Reply-To": "hello@durhack.com",
      to: user.email,
      subject: `Your DurHack verification code is ${user.verify_code}`,
      text: [
        `Hi ${user.preferred_name},`,
        `Welcome to DurHack! Your verification code is ${user.verify_code}`,
        "If you have any questions, please chat to one of us.",
        "Thanks,",
        "The DurHack Team",
        "(If you didn't request this code, you can safely ignore this email.)",
      ].join("\n\n"),
    });
  }

  static sign_up_payload_schema = z.object({
    email: z.string().email(),
    send_again: z.boolean().default(false),
  });

  static async handleVerifyEmail(request: Request, response: Response) {
    const { email, send_again } = AuthHandlers.sign_up_payload_schema.parse(request.body);

    const user = await User.findOneByEmail(email, new NullError("Email address not recognised."));

    if (!send_again && user.verify_code && !AuthHandlers.verifyCodeExpired(user)) {
      return sendStandardResponse(response, 304, "Verification email already sent");
    }

    try {
      await AuthHandlers.sendVerifyCode(user);
    } catch (error) {
      throw createHttpError.BadGateway("Failed to send verification email.");
    }

    return sendStandardResponse(response, 200, "Verification email sent.");
  }

  static set_password_schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    verify_code: z.string().length(6)
  });

  static async handleSetPassword(request: Request, response: Response, next: NextFunction) {
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

    return next();
  }

  @requireLoggedIn
  static async handleGetSocketToken(request: Request, response: Response): Promise<void> {
    const auth_token = await TokenVault.createAccessToken(request.user!, [ "socket:state" ]);
    response.status(200);
    response.json({ "status": 200, "message": "Token generation OK", "token": auth_token });
  }
}
