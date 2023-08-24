"use client";

import { io, Socket } from "socket.io-client";
import OBSWebSocket from "obs-websocket-js";
import { isEqual } from "lodash";
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
          <OverlaySlides/>
          <OverlayMilestone/>
        </OverlayMainWrapper>

        <div className="text-pattern-bg">
          <div className="lines">
            <div className="a"></div>
            <div className="b"></div>
            <div className="c"></div>
            <div className="d"></div>
            <div className="e"></div>
            <div className="a"></div>
            <div className="b"></div>
            <div className="c"></div>
            <div className="d"></div>
            <div className="e"></div>
            <div className="a"></div>
            <div className="b"></div>
            <div className="c"></div>
            <div className="d"></div>
            <div className="e"></div>
            <div className="a"></div>
            <div className="b"></div>
            <div className="c"></div>
            <div className="d"></div>
            <div className="e"></div>
          </div>

          <div className="foreground">
            <div>
              <div className="countdown"></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
