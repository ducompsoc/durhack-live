"use client"

import { EventEmitter } from "events"
import * as React from "react"
import { type Socket, io } from "socket.io-client"

import { makeLiveApiRequest } from "@/lib/api"

export interface IScheduledEvent {
  name: string
  icon: string
  liveLink: string | null
  recordingLink: string | null
  start: string
  end: string
  state: "scheduled" | "in_progress" | "done"
  onStream: boolean
}

export interface IOverlayState {
  currentScene: {
    scene: string
    countdown: number
    music: boolean
  }
  main: {
    darkMode: boolean
    nextUp: {
      enabled: boolean
      pretext: string
      text: string
      when: string
    }
    slides: string[]
  }
  feature: {
    enabled: boolean
    icon: string
    title: string
    text: string
  }
  upperThird: {
    enabled: boolean
    text: string
  }
  lowerThird: {
    enabled: boolean
    icon: string
    pretext: string
    text: string
    when: string
    managedBy: "admin" | "youtube"
  }
  milestone: {
    enabled: boolean
    text: string
    when: string
  }
  youtube: {
    enabled: boolean
    queue: {
      id: string
      lowerThird: string
    }[]
    skipped: number
  }
}

export interface IHackathonState {
  schedule: IScheduledEvent[]
  startedAt: Date
  overlay: IOverlayState
  announcement: {
    enabled: boolean
    title: string
    text: string
    buttonText: string
    buttonLink: string
  }
  tips: string[]
}

export type HackathonConnectedConnection = {
  connected: true
  authenticationLoading: boolean
  roles: string[] | null
  state: IHackathonState
}

export type HackathonConnection =
  | HackathonConnectedConnection
  | { connected: false; authenticationLoading: false; roles: string[] | null; state: IHackathonState | null }

const events = new EventEmitter()
let lastConnection: HackathonConnection = { connected: false, authenticationLoading: false, roles: null, state: null }
let socket: Socket | null = null
let userRoles: string[] | null = null
let authenticationLoading = true

async function getBearerToken(): Promise<string> {
  const request = await makeLiveApiRequest("/auth/socket-token")
  const response = await fetch(request)
  if (!response.ok) throw new Error("Couldn't get socket token.")
  const payload = await response.json()
  const { token } = payload
  if (!token) throw new Error("Couldn't get socket token.")
  return token
}

export async function attemptStateSocketAuth(): Promise<void> {
  if (!socket) return

  if (!sessionStorage.getItem("durhack-live-socket-token-2024")) {
    try {
      sessionStorage.setItem("durhack-live-socket-token-2024", await getBearerToken())
    } catch (error) {
      // assume the error is because the user is unauthenticated
      authenticationLoading = false
      return
    }
  }

  const retrieveRoles = new Promise<void>((resolve, reject) => {
    if (!socket) return

    function authenticateCallback(err: string | null, roles: string[] | null): void {
      if (err) {
        if (err === "Auth failed.") {
          sessionStorage.removeItem("durhack-live-socket-token-2024")
          void attemptStateSocketAuth()
          reject(new Error("Couldn't authenticate socket connection - bad socket token"))
          return
        }

        reject(new Error(err))
        return
      }

      userRoles = roles
      authenticationLoading = false

      if (lastConnection.connected) {
        events.emit("connection", { ...lastConnection, authenticationLoading, roles: userRoles })
      }

      resolve()
    }

    socket.emit("authenticate", sessionStorage.getItem("durhack-live-socket-token-2024"), authenticateCallback)
  })

  await retrieveRoles
  return
}

export function connectStateSocket() {
  if (typeof window === "undefined") return
  if (socket) return

  socket = io(window.location.origin)

  socket.on("connect", () => {
    if (!socket) return
    console.log("Connected. Authenticating...")
    void attemptStateSocketAuth()
  })

  socket.on("globalState", (state: IHackathonState) => {
    lastConnection = { connected: true, authenticationLoading, roles: userRoles, state }
    events.emit("connection", lastConnection)
  })

  socket.on("disconnect", () => {
    authenticationLoading = false
    lastConnection = {
      connected: false,
      authenticationLoading: false,
      roles: userRoles,
      state: lastConnection?.state || null,
    }
    events.emit("connection", lastConnection)
  })
}

export function pushHackathon(newState: IHackathonState) {
  if (!socket) return
  socket.emit("pushState", newState, (error: Error | undefined) => {
    if (!error) return
    console.error(error)
  })
}

export function useHackathon(): HackathonConnection {
  const [connection, setConnection] = React.useState<HackathonConnection>(lastConnection)

  React.useEffect(() => {
    function handleConnection(result: HackathonConnection) {
      setConnection(result)
    }

    events.on("connection", handleConnection)
    return () => {
      events.removeListener("connection", handleConnection)
    }
  })

  return connection
}

void connectStateSocket()
