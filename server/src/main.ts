import { type Server, createServer } from "node:http"
import { App } from "@otterhttp/app"
import { Server as SocketIO } from "socket.io"

import { matchSignedCookie, signCookie, unsignCookie } from "@/common/cookies"

import { listenConfig, origin } from "./config"
import { Request } from "./request"
import { Response } from "./response"
import { apiApp } from "./routes"
import { HackathonStateSocketManager } from "./socket"

const environment = process.env.NODE_ENV
const dev = environment !== "production"

function getApp(): App<Request, Response> {
  const app = new App<Request, Response>({
    settings: {
      setCookieOptions: {
        sign: signCookie,
      },
      cookieParsing: {
        signedCookieMatcher: matchSignedCookie,
        cookieUnsigner: unsignCookie,
      },
    },
  })

  app.use("/api", apiApp)

  return app
}

const app = getApp()

const server = createServer<typeof Request, typeof Response>({
  IncomingMessage: Request,
  ServerResponse: Response,
})
server.on("request", app.attach)
const io = new SocketIO(server as Server)
const stateSocketManager = new HackathonStateSocketManager(io)

server.listen(listenConfig.port, listenConfig.host, () => {
  console.log(
    `> Server listening on http://${listenConfig.host}:${listenConfig.port} as ${dev ? "development" : environment}, access via ${origin}`,
  )
})
