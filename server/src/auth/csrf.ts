import config from "config"
import { Request, Response } from "@tinyhttp/app"
import { doubleCsrf, DoubleCsrfConfig } from "@otterjs/csrf-csrf"

import { double_csrf_options_schema } from "@/common/schema/config"

/* eslint-disable @typescript-eslint/no-explicit-any */
const options = double_csrf_options_schema.parse(config.get("csrf.options")) as DoubleCsrfConfig
options.getSecret = () => config.get("csrf.secret")

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options)

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(request, response)
  response.status(200)
  response.json({ status: 200, message: "Token generation OK", token: csrfToken })
}
