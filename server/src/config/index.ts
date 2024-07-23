import { loadConfig } from "zod-config"
import { directoryAdapter } from "zod-config/directory-adapter"
import { scriptAdapter } from "zod-config/script-adapter"

import { configSchema } from "./schema"
export type * from "./schema"

const config = await loadConfig({
  schema: configSchema,
  adapters: directoryAdapter({
    paths: import.meta.dirname,
    adapters: [
      {
        extensions: [".ts"],
        adapterFactory: (filePath: string) => scriptAdapter({path: filePath})
      }
    ]
  })
})

export const {
  listen: listenConfig,
  flags: configFlags,
  database: databaseConfig,
  csrf: csrfConfig,
  cookieParser: cookieParserConfig,
  jsonwebtoken: jwtConfig,
  oauth: oauthConfig,
  session: sessionConfig,
  discord: discordConfig,
  hackathonStateSocket: hackathonStateSocketConfig,
} = config

export { config }
