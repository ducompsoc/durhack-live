import config from "config"
import nextSession from "next-session"

import { session_options_schema } from "@/common/schema/config"

const session_options = session_options_schema.parse(config.get("session"))

export const getSession = nextSession({
  store: undefined,
  ...session_options,
})
