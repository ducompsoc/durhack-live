import React from "react";

import { IHackathonState } from "@/app/util/socket";

export const HackathonContext = React.createContext<IHackathonState | null>(null);
