"use client"

import dynamic from "next/dynamic"

import { FeedOverlay, MusicVolumeController, OverlayMainWrapper, OverlayMilestone } from "@/components/overlay"

const OverlaySlides = dynamic(() => import("@/components/overlay/overlay-slides").then((mod) => mod.OverlaySlides), {
  ssr: false,
})

export default function LivestreamOverlay() {
  return (
    <main>
      <div className="canvas">
        <FeedOverlay />

        <OverlayMainWrapper>
          <OverlaySlides />
          <OverlayMilestone />
        </OverlayMainWrapper>

        <MusicVolumeController />
      </div>
    </main>
  )
}
