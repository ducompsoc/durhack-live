import type { Request, Response } from "@otterhttp/app"

export type Middleware = (req: Request, res: Response, next: () => void) => Promise<void> | void
