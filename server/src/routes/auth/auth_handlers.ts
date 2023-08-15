import { Request, Response } from "express";
import createHttpError from "http-errors";
import * as EmailValidator from "email-validator";

import { NullError } from "@/common/errors";
import User from "@/database/user";

import { hashPasswordText, validatePassword, randomBytesAsync } from "@/auth/auth_util";
import * as process from "process";
import { sendStandardResponse } from "@/common/response";


export default class AuthHandlers {
  private static ensureCorrectVerifyCode(user: User, verify_code_attempt: string): void {
    if (process.env.MEGATEAMS_SKIP_EMAIL_VERIFICATION === "true") {
      return;
    }

    if (user.verify_code === null || user.verify_sent_at === null) {
      throw new createHttpError.BadRequest("Verify code not set.");
    }

    // verification codes are valid for 5 minutes (in milliseconds)
    if ((Date.now() - user.verify_sent_at) > 300_000) {
      throw new createHttpError.BadRequest("Verify code expired.");
    }

    if (user.verify_code !== verify_code_attempt) {
      throw new createHttpError.BadRequest("Verify code incorrect.");
    }
  }

  static async handleLoginSuccess(request: Request, response: Response) {
    throw new createHttpError.NotImplemented("Login success handler not implemented");
  }

  static async handleSignUp(request: Request, response: Response) {
    throw new createHttpError.NotImplemented("Sign up handler not implemented");
  }

  static async handleSetPassword(request: Request, response: Response) {
    if (request.user) {
      throw new createHttpError.BadRequest("You are already logged in!");
    }

    let email: unknown;
    let password: unknown;
    let verify_code: unknown;
    ({ email, password, verify_code } = request.body);

    if (typeof email !== "string" || !EmailValidator.validate(email)) {
      throw new createHttpError.BadRequest("Email address needs to be mailable.");
    }

    if (typeof password !== "string" || !validatePassword(password)) {
      throw new createHttpError.BadRequest("Password should be a string containing no illegal characters.");
    }

    if (typeof verify_code !== "string") {
      throw new createHttpError.BadRequest("Verify code should be a string.");
    }

    let found_user: User;
    try {
      found_user = await User.findOne({ where: { email }, rejectOnEmpty: new NullError() });
    } catch (error) {
      if (error instanceof NullError) throw new createHttpError.NotFound("It looks like you didn't fill in the sign-up form - try another email address, or speak to a DurHack volunteer if you believe this is an error!");
      throw error;
    }

    this.ensureCorrectVerifyCode(found_user, verify_code);

    const password_salt = await randomBytesAsync(16);
    found_user.hashed_password = await hashPasswordText(password, password_salt);
    found_user.password_salt = password_salt;

    await found_user.save();

    sendStandardResponse(response, 200);
  }
}
