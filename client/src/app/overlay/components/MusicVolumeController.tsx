"use client";

import React from "react";

import { useHackathon } from "@/app/util/socket";
import { useAsyncEffect } from "@/app/util/useAsyncEffect";

import obs from "../obs-socket";


export default function MusicVolumeController() {
  const { state } = useHackathon();
  const [ musicEnabled, setMusicEnabled ] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    setMusicEnabled(newOverlayState.currentScene.music);
  }, [state]);

  const { result }: { result: [interval: number, currentVolume: number] } = useAsyncEffect(
    async () => {
      if (musicEnabled === null) return;

      const { inputVolumeMul: currentVolume } = await obs.call("GetInputVolume", { inputName: "Desktop Audio" });
      const { inputMuted: currentMuted } = await obs.call("GetInputMute", { inputName: "Desktop Audio" });

      // What's the volume now?
      console.info(`Volume is ${currentVolume} and want muted to be ${!musicEnabled}, currently ${currentMuted}.`);

      // If music is already muted, do nothing
      if (musicEnabled === !currentMuted) return;

      const interval = musicEnabled
        ? await startUnmuting(currentVolume)
        : await startMuting(currentVolume);

      return [interval, currentVolume];
    },
    async () => {
      const [interval, currentVolume] = result;
      clearInterval(interval);

      if (typeof currentVolume === "undefined") return;

      await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: currentVolume })
        .catch(console.error);
      await obs.call("SetInputMute", { inputName: "Desktop Audio", inputMuted: !musicEnabled })
        .catch(console.error);

    },
    [musicEnabled]
  );

  async function startMuting(originalVolume: number) {
    console.info("starting mute");
    let tweenVolume = originalVolume;
    const interval = setInterval(async () => {
      tweenVolume -= 0.05;

      if (tweenVolume <= 0) {
        clearInterval(interval);

        // Now mute it altogether.
        await obs.call("SetInputMute", { inputName: "Desktop Audio", inputMuted: true })
          .catch(console.error);
        // And set the volume back to whatever it was before.
        await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: originalVolume })
          .catch(console.error);

        return;
      }

      console.info(`Set volume to ${tweenVolume}...`);
      await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: tweenVolume })
        .catch(console.error);
    }, 500);

    return interval;
  }

  async function startUnmuting(originalVolume: any) {
    console.info("starting unmute");
    // set volume to zero and unmute.
    await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: 0 });
    await obs.call("SetInputMute", { inputName: "Desktop Audio", inputMuted: false });

    // Slowly drag the volume up
    let tweenVolume = 0;
    let interval = setInterval(async () => {
      tweenVolume += 0.05;
      if (tweenVolume >= originalVolume) {
        clearInterval(interval);

        await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: originalVolume })
          .catch(console.error);

        return;
      }
      console.info(`Set volume to ${tweenVolume}...`);
      await obs.call("SetInputVolume", { inputName: "Desktop Audio", inputVolumeMul: tweenVolume })
        .catch(console.error);
    }, 500);

    return interval;
  }

  return <></>;
}
