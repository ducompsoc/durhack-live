import config from "config"
import Local, { IStrategyOptions, VerifyFunction } from "passport-local"
import passport from "passport"

import User from "@/database/tables/user"
import { passport_local_options_schema } from "@/common/schema/config"
import { NullError, ConflictError } from "@/common/errors"

import { checkTextAgainstHash } from "@/auth/hashed_secrets"

async function checkPassword(user: User, password_attempt: string): Promise<boolean> {
  if (!(user.password_salt instanceof Buffer && user.hashed_password instanceof Buffer)) {
    throw new ConflictError("Password has not been set")
  }
  return await checkTextAgainstHash(
    {
      hashed_secret: user.hashed_password,
      salt: user.password_salt,
    },
    password_attempt,
  )
}

const localVerifyFunction: VerifyFunction = async function (username, password, callback) {
  /**
   * Verify function for Passport.js.
   *
   * @param username - email address to search for user with
   * @param password - password to attempt to log in as user with
   * @param callback - function to call with (error, user) when done
   */
  let user: User
  try {
    user = await User.findOne({ where: { email: username }, rejectOnEmpty: new NullError() })
  } catch (error) {
    if (error instanceof NullError) {
      return callback(null, false, { message: "Incorrect username or password." })
    }
    return callback(error)
  }

  try {
    if (!(await checkPassword(user, password))) {
      return callback(null, false, { message: "Incorrect username or password." })
    }
  } catch (error) {
    return callback(error)
  }

  return callback(null, user)
}

const strategy_options = passport_local_options_schema.parse(config.get("passport.local")) as IStrategyOptions
const local_strategy = new Local.Strategy(strategy_options, localVerifyFunction)

passport.use("local", local_strategy)
