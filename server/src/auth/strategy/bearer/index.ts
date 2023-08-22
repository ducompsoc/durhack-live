import config from "config";
import { VerifyFunction, IStrategyOptions } from "passport-http-bearer";
import passport from "passport";

import { passport_bearer_options_schema } from "@/common/schema/config";
import User from "@/database/user";
import { NullError } from "@/common/errors";

import BearerStrategy from "./strategy";
import TokenVault from "./util";
import { TokenError } from "./jwt_error";


const bearerVerifyFunction: VerifyFunction = async function(token, callback) {
  /**
   * Verify function for Passport.js.
   *
   * @param token - Token to search for user with
   * @param callback - function to call with (error, user) when done
   */

  let decodedPayload;
  try {
    decodedPayload = (await TokenVault.decodeAccessToken(token)).payload;
  } catch (error) {
    return callback(null, false, { message: "Token validation failure", scope: [] });
  }

  let user: User;
  let scope: string[];
  try {
    ({ user, scope } = await TokenVault.getUserAndScopeClaims(decodedPayload));
  } catch (error) {
    if (error instanceof TokenError) {
      return callback(null, false, { message: error.message, scope: [] });
    }
    if (error instanceof NullError) {
      return callback(null, false, { message: "User not found", scope: [] });
    }
    return callback(error);
  }

  return callback(null, user, { scope: scope });
};

const strategy_options = passport_bearer_options_schema.parse(config.get("passport.bearer")) as IStrategyOptions;
const bearer_strategy = new BearerStrategy(strategy_options, bearerVerifyFunction);

passport.use("bearer", bearer_strategy);