import { loadConfig } from "zod-config"
import { directoryAdapter } from "zod-config/directory-adapter"
import { scriptAdapter } from "zod-config/script-adapter"
import path from "node:path"

import { dirname } from "@/dirname";

import { configSchema } from "./schema"
export type * from "./schema"

const config = await loadConfig({
  schema: configSchema,
  adapters: directoryAdapter({
    paths: path.join(dirname, "config"),
    adapters: [
      {
        extensions: [".ts", ".js"],
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
