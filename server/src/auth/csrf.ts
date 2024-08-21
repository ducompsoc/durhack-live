import type { Request, Response } from "@otterhttp/app"
import { type CsrfSecretRetriever, type DoubleCsrfConfig, doubleCsrf } from "@otterhttp/csrf-csrf"

import { csrfConfig } from "@/config"

const {
  cookieOptions: { signed, ...cookieOptions },
  ...rest
} = csrfConfig.options

const cookieSigningOptions: { signed: true; getSigningSecret: CsrfSecretRetriever } | { signed: false } = signed
  ? { signed: true, getSigningSecret: () => "" }
  : { signed: false }

const options = {
  cookieOptions: Object.assign({}, cookieOptions, cookieSigningOptions),
  ...rest,
  getSessionIdentifier: () => "uh oh",
  getSecret: () => csrfConfig.secret,
} satisfies DoubleCsrfConfig

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options)

export function handleGetCsrfToken(request: Request, response: Response): void {
  const csrfToken = generateToken(request, response)
  response.status(200)
  response.json({ status: 200, message: "Token generation OK", token: csrfToken })
}
