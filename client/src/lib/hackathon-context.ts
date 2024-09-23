import * as React from "react";

import { IHackathonState } from "@/lib/socket";

export const HackathonContext = React.createContext<IHackathonState | null>(null);
