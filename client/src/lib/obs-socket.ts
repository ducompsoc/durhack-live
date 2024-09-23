"use client"

import OBSWebSocket from "obs-websocket-js"

export const obsSocket = new OBSWebSocket()

export async function connectObsSocket() {
  if (typeof window === "undefined") return
  try {
    await obsSocket.connect("ws://192.168.1.12:4444", "U522flbQAvlb6MBA")
    console.log("Connected to OBS.")
  } catch (error) {
    console.log("Couldn't connect to OBS.")
  }
}

void connectObsSocket()
