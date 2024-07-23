import nextSession from "next-session"
import { sign, unsign } from "@tinyhttp/cookie-signature"

import { sessionConfig } from "@/config"

const { signingSecret, ...sessionOptions } = sessionConfig

export const getSession = nextSession({
  store: undefined,
  encode: (raw: string): string => `s:${sign(raw, signingSecret)}`,
  decode: (signed: string): string | null => unsign(signed.slice(2), signingSecret) || null,
  ...sessionOptions,
})
