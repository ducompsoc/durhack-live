import config from "config";
import { VerifyFunction, IStrategyOptions } from "passport-http-bearer";
import passport from "passport";

import { passport_bearer_options_schema } from "@/common/config_schema";

import BearerStrategy from "./strategy";

const bearerVerifyFunction: VerifyFunction = async function(token, callback) {
  return callback(null, false);
};

const strategy_options = passport_bearer_options_schema.parse(config.get("passport.bearer")) as IStrategyOptions;
const bearer_strategy = new BearerStrategy(strategy_options, bearerVerifyFunction);

passport.use("bearer", bearer_strategy);