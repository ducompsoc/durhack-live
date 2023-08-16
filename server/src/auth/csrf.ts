import config from "config";
import { Request, Response } from "express";
import { doubleCsrf, DoubleCsrfConfig } from "csrf-csrf";

import { double_csrf_options_schema } from "@/common/config_schema";

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = double_csrf_options_schema.parse(config.get("csrf.options")) as DoubleCsrfConfig;
options.getSecret = () => config.get("csrf.secret");

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options);

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(response, request);
  response.status(200);
  response.json({ "status": 200, "message": "Token generation OK", "token": csrfToken });
}
