"use client"

import {
  FeedOverlay,
  MusicVolumeController,
  OverlayMainWrapper,
  OverlayMilestone,
  OverlaySlides,
} from "@/components/overlay"

export default function LivestreamOverlayClient() {
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
