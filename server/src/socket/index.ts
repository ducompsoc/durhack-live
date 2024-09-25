import assert from "node:assert/strict"
import { TokenType } from "@durhack/token-vault/lib"
import { ServerError } from "@otterhttp/errors"
import type { JWTPayload } from "jose"
import type { Socket, Server as SocketIOServer } from "socket.io"
import { ZodError } from "zod"

import { adaptTokenSetToClient, adaptTokenSetToDatabase } from "@/auth/adapt-token-set"
import { type KeycloakUserInfo, keycloakClient } from "@/auth/keycloak-client"
import TokenVault from "@/auth/tokens"
import { isNetworkError } from "@/common/is-network-error"
import { type IHackathonState, hackathonStateSchema } from "@/common/schema/hackathon-state"
import { type User, prisma } from "@/database"

import type { UserinfoResponse } from "openid-client"
import { getHackathonState, setHackathonState } from "./state"

class HackathonStateSocketConnection {
  connectedUser?: User
  manager: HackathonStateSocketManager
  socket: Socket

  constructor(manager: HackathonStateSocketManager, socket: Socket) {
    this.manager = manager
    this.socket = socket

    this.performInitialConnectActions()
  }

  private performInitialConnectActions() {
    this.socket.on("authenticate", this.onAuthenticate.bind(this))
    this.socket.on("disconnect", this.onDisconnect.bind(this))
    this.socket.join("state:global")
    this.socket.emit("globalState", getHackathonState())
  }

  private async onAuthenticate(token: unknown, cb: (err: string | null, userRoles: string[] | null) => void) {
    if (this.connectedUser) return
    if (typeof token !== "string" || typeof cb !== "function") return

    let decodedPayload: JWTPayload
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.accessToken, token)).payload
    } catch (error) {
      return cb("Auth failed.", null)
    }

    let user: User
    let scope: string[]
    try {
      ;({ user, scope } = await TokenVault.getUserAndScopeClaims(decodedPayload))
    } catch (error) {
      return cb("Auth failed.", null)
    }

    if (user.tokenSet == null) return cb("Auth failed.", null)
    if (!scope.includes("socket:state")) return cb("Auth failed.", null)

    // if the token set has expired, we try to refresh it
    let tokenSet = adaptTokenSetToClient(user.tokenSet)
    if (tokenSet.expired() && tokenSet.refresh_token != null) {
      try {
        tokenSet = await keycloakClient.refresh(tokenSet.refresh_token)
        await prisma.tokenSet.update({
          where: { userId: user.keycloakUserId },
          data: adaptTokenSetToDatabase(tokenSet),
        })
      } catch (error) {
        if (isNetworkError(error)) {
          return cb("Encountered network error while attempting to refresh a token set", null)
        }
        assert(error instanceof Error)
        console.error(`Failed to refresh access token for ${tokenSet.claims().email}: ${error.stack}`)
      }
    }

    // if the token set is still expired, the user needs to log in again
    if (tokenSet.expired() || tokenSet.access_token == null) {
      return cb("Auth failed.", null)
    }

    // use the token set to get the user profile
    let profile: UserinfoResponse<KeycloakUserInfo> | undefined
    try {
      profile = await keycloakClient.userinfo<KeycloakUserInfo>(tokenSet.access_token)
    } catch (error) {
      if (isNetworkError(error)) {
        throw new ServerError("Encountered network error while attempting to fetch profile info", {
          statusCode: 500,
          exposeMessage: false,
          cause: error,
        })
      }

      assert(error instanceof Error)
      console.error(`Failed to fetch profile info for ${tokenSet.claims().email}: ${error.stack}`)

      // if the access token is rejected, the user needs to log in again
      return cb("Auth failed.", null)
    }

    this.connectedUser = user

    if (profile.groups?.includes("/admins")) this.socket.on("pushState", this.onPushState.bind(this))
    cb(null, profile.groups ?? [])
  }

  private async onPushState(state: unknown, cb: (error: Error | null) => void) {
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
    this.manager.connections.delete(this.socket.id)
  }
}

export class HackathonStateSocketManager {
  server: SocketIOServer
  connections: Map<string, HackathonStateSocketConnection>

  constructor(server: SocketIOServer) {
    this.server = server
    this.connections = new Map()
    this.addServerEventListeners()
  }

  private addServerEventListeners(): void {
    this.server.on("connection", this.onConnection.bind(this))
  }

  private onConnection(socket: Socket) {
    this.connections.set(socket.id, new HackathonStateSocketConnection(this, socket))
  }
}
