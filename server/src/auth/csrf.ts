import { type DoubleCsrfConfig, doubleCsrf } from "@otterhttp/csrf-csrf"

import { getSession } from "@/auth/session"
import { csrfConfig } from "@/config"
import type { Request } from "@/request"
import type { Response } from "@/response"

const options = {
  ...csrfConfig.options,
  getSessionIdentifier: async (req, res) => {
    const session = await getSession(req, res)
    return session.id
  },
  getSecret: () => csrfConfig.secret,
} satisfies DoubleCsrfConfig<Request, Response>

export const { generateToken, doubleCsrfProtection } = doubleCsrf(options)

export async function handleGetCsrfToken(request: Request, response: Response): Promise<void> {
  const csrfToken = await generateToken(request, response)
  response.status(200)
  response.json({ status: 200, message: "Token generation OK", token: csrfToken })
}
