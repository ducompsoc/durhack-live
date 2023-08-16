import config from "config";
import Bearer, { VerifyFunction, IStrategyOptions } from "passport-http-bearer";
import passport from "passport";
import createHttpError from "http-errors";

import User from "@/database/user";
import { NullError } from "@/common/errors";
import { passport_bearer_options_schema } from "@/common/config_schema";


const bearerVerifyFunction: VerifyFunction = async function(token, callback) {
  throw createHttpError.NotImplemented();
};

const strategy_options = passport_bearer_options_schema.parse(config.get("passport.bearer")) as IStrategyOptions;
const bearer_strategy = new Bearer.Strategy(strategy_options, bearerVerifyFunction);

passport.use("bearer", bearer_strategy);