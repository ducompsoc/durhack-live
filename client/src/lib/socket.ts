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

export interface IHackathonConnectedConnection {
  connected: true
  role: string | null
  state: IHackathonState
}

export type THackathonConnection =
  | IHackathonConnectedConnection
  | { connected: false; role: string | null; state: IHackathonState | null }

const events = new EventEmitter()
let lastConnection: THackathonConnection = { connected: false, role: null, state: null }
let socket: Socket | null = null
const userRole: string | null = null

async function getBearerToken(): Promise<string> {
  const request = await makeLiveApiRequest("/auth/socket-token")
  const response = await fetch(request)
  if (!response.ok) throw new Error("Couldn't get socket token.")
  const payload = await response.json()
  const { token } = payload
  if (!token) throw new Error("Couldn't get socket token.")
  return token
}

export async function attemptStateSocketAuth() {
  if (!socket) return

  if (!sessionStorage.getItem("durhack-live-socket-token-2023")) {
    try {
      sessionStorage.setItem("durhack-live-socket-token-2023", await getBearerToken())
    } catch (error) {
      console.error(error)
      return
    }
  }

  const retrieveRole = new Promise<string>((resolve, reject) => {
    if (!socket) return

    function authenticateCallback(err: Error | string | null): void {
      if (err) {
        if (err === "Auth failed.") {
          sessionStorage.removeItem("durhack-live-socket-token-2023")
          console.error("Couldn't authenticate socket connection - bad socket token")
          reject(err)
          return
        }

        console.error(err)
        reject(err)
        return
      }

      // todo: replace with keycloak
      reject(new Error("User role is null"))
      return

      // biome-ignore lint/correctness/noUnreachable: see todo
      if (lastConnection.connected) {
        events.emit("connection", lastConnection)
      }

      console.info("Authenticated.")
    }

    socket.emit("authenticate", sessionStorage.getItem("durhack-live-socket-token-2023"), authenticateCallback)
  })

  return await retrieveRole
}

export function connectStateSocket() {
  if (typeof window === "undefined") return
  if (socket) return

  socket = io(window.location.origin)

  socket.on("connect", async () => {
    if (!socket) return
    console.log("Connected. Authenticating...")
    void (await attemptStateSocketAuth())
  })

  socket.on("globalState", (state: IHackathonState) => {
    lastConnection = { connected: true, role: userRole, state }
    events.emit("connection", lastConnection)
  })

  socket.on("disconnect", () => {
    lastConnection = { connected: false, role: userRole, state: lastConnection?.state || null }
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

export function useHackathon(): THackathonConnection {
  const [connection, setConnection] = React.useState<THackathonConnection>(lastConnection)

  React.useEffect(() => {
    function handleConnection(result: THackathonConnection) {
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
