import * as React from "react"

import type { IHackathonState } from "@/lib/socket"

export const HackathonContext = React.createContext<IHackathonState | null>(null)
