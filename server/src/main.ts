import { type Server, createServer } from "node:http"
import { App } from "@otterhttp/app"
import { Server as SocketIO } from "socket.io"

import { matchSignedCookie, signCookie, unsignCookie } from "@/common/cookies"

import { listenConfig } from "./config"
import { Request } from "./request"
import { Response } from "./response"
import { apiApp } from "./routes"
import HackathonStateSocketManager from "./socket"
import getStateSocketClient, { updateStateSocketSecret } from "./socket/oauth-client"

const environment = process.env.NODE_ENV
const dev = environment !== "production"

function getApp(): App {
  const app = new App<Request, Response>({
    settings: {
      setCookieOptions: {
        encode: signCookie,
      },
      cookieParsing: {
        encodedCookieMatcher: matchSignedCookie,
        cookieDecoder: unsignCookie,
      },
    },
  })

  app.use("/api", apiApp)

  return app
}

// @ts-expect-error
function getServer(app: App): Server<typeof Request, typeof Response> {
  // @ts-expect-error
  const server = createServer<typeof Request, typeof Response>({
    IncomingRequest: Request,
    ServerResponse: Response,
  })
  server.on("request", app.attach)
  const io = new SocketIO(server as Server)
  HackathonStateSocketManager.initialise(io)

  return server
}

async function main() {
  const client = await getStateSocketClient()
  await updateStateSocketSecret(client)

  const app = getApp()
  const server = getServer(app)

  server.listen(listenConfig.port, listenConfig.host, () => {
    console.log(
      `> Server listening on http://${listenConfig.host}:${listenConfig.port} as ${dev ? "development" : environment}`,
    )
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
