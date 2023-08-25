"use client";

import {
  OverlayUpperThird,
  OverlayLowerThird,
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

        <OverlayUpperThird />
        <OverlayLowerThird />

        <OverlayMainWrapper>
          <OverlaySlides />
          <OverlayMilestone />
        </OverlayMainWrapper>
      </div>
    </main>
  );
}
