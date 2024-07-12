"use client";

import React from "react";
import isEqual from "lodash/isEqual";

import { useHackathon, IOverlayState } from "@/app/util/socket";

import { waitFor } from "@/app/util/util";


export default function OverlayUpperThird() {
  const { state } = useHackathon();
  const [lastUpperThird, setLastUpperThird] = React.useState<IOverlayState["upperThird"] | null>(null);

  const [text, setText] = React.useState<string | null>(state?.overlay.upperThird.text || null);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    void onHackathonStateChange();
  }, [state]);

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    if (isEqual(lastUpperThird, newOverlayState.upperThird)) return;

    setLastUpperThird(newOverlayState.upperThird);
    void updateUpperThird(newOverlayState.upperThird);
  }

  async function animateOutUpperThird() {
    const upperThirdContainer = containerRef.current;
    if (!upperThirdContainer) return;

    // the container is already animated out; do nothing
    if (!upperThirdContainer.classList.contains("animate-in")) return;

    upperThirdContainer.classList.remove("animate-in");
    upperThirdContainer.classList.add("animate-out");
    await waitFor(1.5);
    upperThirdContainer.classList.remove("animate-out"); // performance
  }

  async function updateUpperThird(options: IOverlayState["upperThird"]) {
    const { enabled, text } = options;

    await animateOutUpperThird();

    if (!enabled) return;

    setText(text);

    const upperThirdContainer = containerRef.current;
    if (!upperThirdContainer) return;
    upperThirdContainer.classList.add("animate-in");
  }

  return (
    <div className="upper-third" ref={containerRef}>
      <div>{text}</div>
    </div>
  );
}
