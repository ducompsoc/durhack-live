import type { ConfigIn } from "./schema"
import { DeepPartial } from "@/types/deep-partial";

export default {
  flags: {},
  oauth: {}
} satisfies DeepPartial<ConfigIn>
