"use client";

import {
  OverlayMainWrapper,
  OverlaySlides,
  OverlayMilestone,
  FeedOverlay,
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
      </div>
    </main>
  );
}
