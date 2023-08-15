import Bearer, { VerifyFunction } from "passport-http-bearer";
import passport from "passport";
import createHttpError from "http-errors";

import User from "@/database/user";
import { NullError } from "@/common/errors";

const bearerVerifyFunction: VerifyFunction = async function(token, callback) {
  throw createHttpError.NotImplemented();
}

const bearer_strategy = new Bearer.Strategy(bearerVerifyFunction);

passport.use("bearer", bearer_strategy);