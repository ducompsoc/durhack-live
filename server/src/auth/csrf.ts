import config from "config";
import { Request, Response } from "express";
import { doubleCsrf } from "csrf-csrf";

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = config.get("csrf.options") as any;
options.getSecret = () => config.get("csrf.secret");

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options);

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(response, request);
  response.status(200);
  response.json({ "status": 200, "message": "Token generation OK", "token": csrfToken });
}
