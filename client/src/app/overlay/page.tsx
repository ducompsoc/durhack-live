"use client";

import {
  OverlayMainWrapper,
  OverlayMilestone,
  FeedOverlay,
  MusicVolumeController
} from "./components";
import dynamic from "next/dynamic";

const OverlaySlides = dynamic(() => import("./components/OverlaySlides"), {
  ssr: false,
});


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
