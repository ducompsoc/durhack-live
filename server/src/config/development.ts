import type { DeepPartial } from "@/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  flags: {},
  oauth: {},
  keycloak: {
    redirectUris: ["http://localhost:3001/api/auth/keycloak/callback"]
  }
} satisfies DeepPartial<ConfigIn>
