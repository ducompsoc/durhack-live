"use client";

import React from "react";
import isEqual from "lodash/isEqual";

import { useHackathon, pushHackathon, IOverlayState } from "@/app/util/socket";

import { YoutubeContext } from "./FeedOverlay";
import { waitFor } from "@/app/util/util";
import NextUpCountdown from "@/app/overlay/components/NextUpCountdown";


export default function OverlayLowerThird() {
  const { state } = useHackathon();
  const [lastLowerThird, setLastLowerThird] = React.useState<IOverlayState["lowerThird"] | null>(null);

  const [pretext, setPretext] = React.useState<string | null>(state?.overlay.lowerThird.pretext || null);
  const [text, setText] = React.useState<string | null>(state?.overlay.lowerThird.text || null);
  const [icon, setIcon] = React.useState<string | null>(state?.overlay.lowerThird.icon || null);
  const [when, setWhen] = React.useState<Date | null>(() => {
    const when = state?.overlay.lowerThird.when;
    if (!when) return null;
    return new Date(when);
  });

  const youtubeState = React.useContext(YoutubeContext);
  const [hideTimeout, setHideTimeout] = React.useState<ReturnType<typeof setTimeout> | undefined>(undefined);

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    void onHackathonStateChange();
  }, [state]);

  React.useEffect(() => {
    void onYoutubeStateChange();
  }, [youtubeState]);

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    if (!isEqual(lastLowerThird, newOverlayState.lowerThird)) {
      setLastLowerThird(newOverlayState.lowerThird);
      void updateLowerThird(newOverlayState.lowerThird);
    }
  }

  async function onYoutubeStateChange() {
    if (!youtubeState?.lowerThirdText) return;

    if (state) {
      const updatedLowerThird: IOverlayState["lowerThird"] = {...state.overlay.lowerThird, managedBy: "youtube"};
      await pushHackathon({...state, overlay: {...state.overlay, lowerThird: updatedLowerThird}});
    }

    await updateLowerThird({
      enabled: true,
      icon: "fas fa-film",
      pretext: "",
      text: youtubeState?.lowerThirdText,
      when: "",
      managedBy: "youtube",
    });

    const timeout = setTimeout(() => {
      void animateOutLowerThird();
    }, 16000);
    setHideTimeout(timeout);
  }

  async function animateOutLowerThird() {
    clearTimeout(hideTimeout);
    const lowerThirdContainer = containerRef.current;
    if (!lowerThirdContainer) return;

    // the container is already animated out; do nothing
    if (!lowerThirdContainer.classList.contains("animate-in")) return;

    lowerThirdContainer.classList.remove("animate-in");
    lowerThirdContainer.classList.add("animate-out");
    await waitFor(1.5);
    lowerThirdContainer.classList.remove("animate-out"); // performance
  }

  async function updateLowerThird(options: IOverlayState["lowerThird"]) {
    const { enabled, icon, pretext, text, when } = options;

    await animateOutLowerThird();

    if (!enabled) return;

    setIcon(icon);
    setPretext(pretext);
    setText(text);
    setWhen(new Date(when));

    const lowerThirdContainer = containerRef.current;
    if (!lowerThirdContainer) return;
    lowerThirdContainer.classList.add("animate-in");
  }

  return (
    <div className="lower-third" ref={containerRef}>
      <div className={pretext? "pre-text active" : "pre-text"}>
        <div className="text">{pretext}</div>
      </div>
      <div className="main-text">
        <div className="bg"></div>
        <div className="icon">
          <span className={icon || ""}></span>
        </div>
        <div className="text">
          {text?.split("||").map((part, index) => <div key={index}>{part}</div>)}
        </div>
        {when ? <NextUpCountdown countdownTo={when} className={"countdown"}/> : null}
      </div>
    </div>
  );
}
