import type { DeepPartial } from "@/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  flags: {},
  oauth: {},
} satisfies DeepPartial<ConfigIn>
