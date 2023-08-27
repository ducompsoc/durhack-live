"use client";
import React from "react";
import YouTube, {YouTubePlayer, YouTubeProps} from "react-youtube";

import {IOverlayState, useHackathon} from "@/app/util/socket";

import { OverlayUpperThird, OverlayLowerThird } from "./";
import {platform} from "os";
import {isEqual} from "lodash";

interface YoutubePlayerState {
  currentlyPlaying: string;
  lowerThirdText?: string;
}

export const YoutubeContext = React.createContext<YoutubePlayerState | null>(null);

export default function OverlayYoutubeQueue() {
  const { state } = useHackathon();
  const [lastOverlayYoutube, setLastOverlayYoutube] = React.useState<IOverlayState["youtube"] | null>(null);
  const [youtubeOpts, setYoutubeOpts] = React.useState<YouTubeProps["opts"]>({
    height: "720",
    width: "1280",
    playerVars: {
      controls: 0,
      autoplay: 1,
    },
  });
  const [queue, setQueue] = React.useState<IOverlayState["youtube"]["queue"]>(state?.overlay.youtube.queue || []);
  const [lastPlayerStateIndex, setLastPlayerStateIndex] = React.useState<number>(YouTube.PlayerState.UNSTARTED);
  const [contextState, setContextState] = React.useState<YoutubePlayerState | null>(null);
  const youtubeRef = React.useRef<YouTube | null>( null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    void onHackathonStateChange();
  }, [state]);

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    if (!isEqual(lastOverlayYoutube, newOverlayState.youtube)
    ) {
      setLastOverlayYoutube(newOverlayState.youtube);
      void updateYoutube(newOverlayState.youtube);
    }
  }

  async function updateYoutube(options: IOverlayState["youtube"]) {
    const youtubeElement = youtubeRef.current;
    if (!youtubeElement) return;

    const containerElement = containerRef.current;
    if (!containerElement) return;

    const { enabled, queue } = options;

    if (!enabled) {
      containerElement.classList.remove("animate-in");

      if (youtubeElement.internalPlayer) {
        await youtubeElement.destroyPlayer();
      }

      setContextState(null);

      return;
    }

    setQueue(queue);

    await youtubeElement.resetPlayer();
  }

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    const youtubeElement = youtubeRef.current;
    if (!youtubeElement) return;

    console.info("Youtube ready.");

    const containerElement = containerRef.current;
    if (!containerElement) return;

    containerElement.classList.add("animate-in");
    event.target.loadPlaylist(queue.map(({ id }) => id));
  };

  function onInitialPlayback(player: YouTubePlayer) {
    const currentId = new URL(player.getVideoUrl()).searchParams.get("v");
    if (!currentId) return;

    const queued = queue.find(({ id }) => id === currentId);

    setContextState({
      currentlyPlaying: currentId,
      lowerThirdText: queued?.lowerThird || undefined
    });
  }

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    const playerState = event.data;

    if (
      lastPlayerStateIndex === YouTube.PlayerState.UNSTARTED
      && playerState === YouTube.PlayerState.PLAYING
    ) {
      onInitialPlayback(event.target);
    }

    if (
      playerState === YouTube.PlayerState.ENDED
    ) {
      setContextState(null);
    }

    setLastPlayerStateIndex(playerState);
  };

  return (
    <>
      <div className="youtube" ref={containerRef}>
        <YouTube
          id={"yt-player"}
          ref={youtubeRef}
          opts={youtubeOpts}
          onReady={onPlayerReady}
          onStateChange={onStateChange}
        />
      </div>

      <YoutubeContext.Provider value={contextState}>
        <OverlayUpperThird />
        <OverlayLowerThird />
      </YoutubeContext.Provider>
    </>
  );
}
