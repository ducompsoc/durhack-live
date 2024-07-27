import { type Server, createServer } from "node:http"
import { App } from "@tinyhttp/app"
import { Server as SocketIO } from "socket.io"

import { listenConfig } from "./config"
import { apiApp } from "./routes"
import HackathonStateSocketManager from "./socket"
import getStateSocketClient, { updateStateSocketSecret } from "./socket/oauth-client"

const environment = process.env.NODE_ENV
const dev = environment !== "production"

function getApp(): App {
  const app = new App()

  app.use("/api", apiApp)

  return app
}

function getServer(app: App): Server {
  const server = createServer()
  server.on("request", app.attach)
  const io = new SocketIO(server)
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
