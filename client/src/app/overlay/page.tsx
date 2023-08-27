"use client";

import {
  OverlayMainWrapper,
  OverlaySlides,
  OverlayMilestone,
  OverlayYoutubeQueue,
} from "./components";


export default function LivestreamOverlay() {
  return (
    <main>
      <div className="canvas">

        <OverlayYoutubeQueue />

        <OverlayMainWrapper>
          <OverlaySlides />
          <OverlayMilestone />
        </OverlayMainWrapper>
      </div>
    </main>
  );
}
