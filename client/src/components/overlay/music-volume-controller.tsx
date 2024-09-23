"use client"

import * as React from "react"

import { useAsyncEffect } from "@/hooks/use-async-effect"
import { obsSocket } from "@/lib/obs-socket"
import { useHackathon } from "@/lib/socket"

export function MusicVolumeController() {
  const { state } = useHackathon()
  const [musicEnabled, setMusicEnabled] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    const newOverlayState = state?.overlay
    if (!newOverlayState) return

    setMusicEnabled(newOverlayState.currentScene.music)
  }, [state])

  const { result }: { result: [interval: number, currentVolume: number] | undefined } = useAsyncEffect(
    async () => {
      if (musicEnabled === null) return

      const { inputVolumeMul: currentVolume } = await obsSocket.call("GetInputVolume", { inputName: "Desktop Audio" })
      const { inputMuted: currentMuted } = await obsSocket.call("GetInputMute", { inputName: "Desktop Audio" })

      // What's the volume now?
      console.info(`Volume is ${currentVolume} and want muted to be ${!musicEnabled}, currently ${currentMuted}.`)

      // If music is already muted, do nothing
      if (musicEnabled === !currentMuted) return

      const interval = musicEnabled ? await startUnmuting(currentVolume) : await startMuting(currentVolume)

      return [interval, currentVolume]
    },
    async () => {
      if (result) {
        const [interval, currentVolume] = result
        window.clearInterval(interval)

        if (typeof currentVolume === "undefined") return
        await obsSocket
          .call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: currentVolume })
          .catch(console.error)
      }

      await obsSocket
        .call("SetInputMute", { inputName: "Desktop Audio", inputMuted: !musicEnabled })
        .catch(console.error)
    },
    [musicEnabled],
  )

  async function startMuting(originalVolume: number) {
    console.info("starting mute")
    let tweenVolume = originalVolume
    const interval = window.setInterval(async () => {
      tweenVolume -= 0.05

      if (tweenVolume <= 0) {
        window.clearInterval(interval)

        // Now mute it altogether.
        await obsSocket.call("SetInputMute", { inputName: "Desktop Audio", inputMuted: true }).catch(console.error)
        // And set the volume back to whatever it was before.
        await obsSocket
          .call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: originalVolume })
          .catch(console.error)

        return
      }

      console.info(`Set volume to ${tweenVolume}...`)
      await obsSocket
        .call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: tweenVolume })
        .catch(console.error)
    }, 500)

    return interval
  }

  async function startUnmuting(originalVolume: number) {
    console.info("starting unmute")
    // set volume to zero and unmute.
    await obsSocket.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: 0 })
    await obsSocket.call("SetInputMute", { inputName: "Desktop Audio", inputMuted: false })

    // Slowly drag the volume up
    let tweenVolume = 0
    const interval = window.setInterval(async () => {
      tweenVolume += 0.05
      if (tweenVolume >= originalVolume) {
        window.clearInterval(interval)

        await obsSocket
          .call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: originalVolume })
          .catch(console.error)

        return
      }
      console.info(`Set volume to ${tweenVolume}...`)
      await obsSocket
        .call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: tweenVolume })
        .catch(console.error)
    }, 500)

    return interval
  }

  return <></>
}
