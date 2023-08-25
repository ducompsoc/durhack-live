"use client";

import YouTube, { YouTubeProps } from "react-youtube";

import {
  OverlayUpperThird,
  OverlayLowerThird,
  OverlayMainWrapper,
  OverlaySlides,
  OverlayMilestone,
} from "./components";


export default function LivestreamOverlay() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {

  };

  return (
    <main>
      <div className="canvas">

        <YouTube className={"youtube"} id={"yt-player"} onReady={onPlayerReady} />

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
