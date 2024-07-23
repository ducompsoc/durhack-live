import { type DoubleCsrfConfig, doubleCsrf } from "@otterjs/csrf-csrf"
import type { Request, Response } from "@tinyhttp/app"

import { csrfConfig } from "@/config"

const options = {
  ...csrfConfig.options,
  getSessionIdentifier: () => "uh oh",
  getSecret: () => csrfConfig.secret,
} satisfies DoubleCsrfConfig

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options)

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(request, response)
  response.status(200)
  response.json({ status: 200, message: "Token generation OK", token: csrfToken })
}
