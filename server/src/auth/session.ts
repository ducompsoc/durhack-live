import session from "@otterhttp/session"

import { sessionConfig } from "@/config"

const { ...sessionOptions } = sessionConfig

export type DurHackLiveSessionRecord = Record<string, unknown>

export const getSession = session<DurHackLiveSessionRecord>({
  ...sessionOptions,
  store: undefined,
})
