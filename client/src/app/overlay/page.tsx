"use client";

import {
  OverlayMainWrapper,
  OverlaySlides,
  OverlayMilestone,
  FeedOverlay,
  MusicVolumeController
} from "./components";


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
  );
}
