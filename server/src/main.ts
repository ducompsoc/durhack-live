import config from "config"
import { App } from "@tinyhttp/app"
import { type Server, createServer } from 'node:http'
import { Server as SocketIO } from "socket.io"

import { listen_options_schema } from "@/common/schema/config"

import sequelize, { ensureDatabaseExists } from "./database"
import { apiApp } from "./routes"
import HackathonStateSocketManager from "./socket"
import getStateSocketClient, { updateStateSocketSecret } from "@/socket/oauth_client"

const environment = process.env.NODE_ENV
const dev = environment !== "production"

function getApp(): App {
  const app = new App()

  app.use("/api", apiApp)

  return app
}

function getServer(app: App): Server {
  const server = createServer()
  server.on('request', app.attach)
  const io = new SocketIO(server)
  HackathonStateSocketManager.initialise(io)

  return server
}

async function main() {
  await ensureDatabaseExists()
  await sequelize.sync({ force: false })

  const client = await getStateSocketClient()
  await updateStateSocketSecret(client)

  const app = getApp()
  const server = getServer(app)

  const listen = listen_options_schema.parse(config.get("listen"))

  server.listen(listen.port, listen.host, () => {
    console.log(`> Server listening on http://${listen.host}:${listen.port} as ${dev ? "development" : environment}`)
  })
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
