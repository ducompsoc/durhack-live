import config from "config";
import { VerifyFunction, IStrategyOptions } from "passport-http-bearer";
import passport from "passport";

import { passport_bearer_options_schema } from "@/common/schema/config";
import User from "@/database/user";
import { NullError } from "@/common/errors";

import BearerStrategy from "./strategy";
import TokenVault from "./util";


const bearerVerifyFunction: VerifyFunction = async function(token, callback) {
  /**
   * Verify function for Passport.js.
   *
   * @param token - Token to search for user with
   * @param callback - function to call with (error, user) when done
   */

  let user_id: unknown;
  try {
    user_id = (await TokenVault.decodeAccessToken(token)).payload["user_id"];
  } catch (error) {
    return callback(null, false, { message: "Token validation failure", scope: [] });
  }

  if (typeof user_id !== "number") return callback(null, false, { message: "Invalid user ID", scope: [] });

  let user;
  try {
    user = await User.findByPk(user_id, { rejectOnEmpty: new NullError() });
  } catch (error) {
    if (error instanceof NullError) {
      return callback(null, false, { message: "User not found", scope: [] });
    }
    return callback(error);
  }

  return callback(null, user, { scope: [ "api" ] });
};

const strategy_options = passport_bearer_options_schema.parse(config.get("passport.bearer")) as IStrategyOptions;
const bearer_strategy = new BearerStrategy(strategy_options, bearerVerifyFunction);

passport.use("bearer", bearer_strategy);