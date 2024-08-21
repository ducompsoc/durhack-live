import { TokenType } from "@durhack/token-vault/lib"
import type { JWTPayload } from "jose"
import type { Server, Socket } from "socket.io"
import { ZodError } from "zod"

import TokenVault from "@/auth/tokens"
import { type IHackathonState, hackathonStateSchema } from "@/common/schema/hackathon-state"
import type { User } from "@/database"

import { getHackathonState, setHackathonState } from "./state"
import "./oauth-client"

class HackathonStateSocketConnection {
  declare connectedUser?: User
  declare manager: HackathonStateSocketManager
  declare socket: Socket

  constructor(manager: HackathonStateSocketManager, socket: Socket) {
    this.manager = manager
    this.socket = socket
    this.addSocketEventListeners()
  }

  private addSocketEventListeners() {
    this.socket.on("authenticate", this.onAuthenticate.bind(this))
    this.socket.on("pushState", this.onPushState.bind(this))
    this.socket.on("disconnect", this.onDisconnect.bind(this))
  }

  private async onAuthenticate(token: unknown, cb: (err: string | null) => void) {
    if (this.connectedUser) return
    if (typeof token !== "string" || typeof cb !== "function") return

    let decodedPayload: JWTPayload
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.accessToken, token)).payload
    } catch (error) {
      return cb("Auth failed.")
    }

    let user: User
    let scope: string[]
    try {
      ;({ user, scope } = await TokenVault.getUserAndScopeClaims(decodedPayload))
    } catch (error) {
      return cb("Auth failed.")
    }

    if (!scope.includes("socket:state")) return cb("Auth failed.")

    this.connectedUser = user

    this.socket.join("state:global")
    this.socket.join(`state:user:${this.connectedUser.keycloakUserId}`)
    this.socket.emit("userState", {})

    cb(null)
    this.socket.emit("globalState", getHackathonState())
  }

  private async onPushState(state: unknown, cb: (error: Error | null) => void) {
    // todo: ensure the connected user is an administrator using KeyCloak
    if (!this.connectedUser) return
    if (this.manager.server == null) return

    let parsedState: IHackathonState
    try {
      parsedState = hackathonStateSchema.parse(state)
    } catch (error) {
      if (!(error instanceof ZodError)) return console.error(error)
      return cb(error)
    }
    await setHackathonState(parsedState)
    this.manager.server.to("state:global").emit("globalState", getHackathonState())
    return cb(null)
  }

  private onDisconnect() {
    this.manager.connections.delete(this)
  }
}

class HackathonStateSocketManager {
  declare server?: Server
  declare connections: Set<HackathonStateSocketConnection>

  constructor() {
    this.connections = new Set()
  }

  public initialise(server: Server): void {
    this.server = server
    this.addServerEventListeners()
  }

  public getServer(): Server | undefined {
    return this.server
  }

  private addServerEventListeners(): void {
    if (!this.server) throw new Error("Manager not initialized.")

    this.server.on("connection", this.onConnection.bind(this))
  }

  private onConnection(socket: Socket) {
    if (!this.server) return
    this.connections.add(new HackathonStateSocketConnection(this, socket))
  }
}

export default new HackathonStateSocketManager()
