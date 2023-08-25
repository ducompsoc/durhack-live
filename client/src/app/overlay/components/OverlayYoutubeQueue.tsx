"use client";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";


export default function OverlayYoutubeQueue() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {

  };

  return (
    <YouTube className={"youtube"} id={"yt-player"} onReady={onPlayerReady} />
  );
}
