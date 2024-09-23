"use client";

import * as React from "react";

import { classList, waitFor } from "@/app/util/util";
import { useHackathon, IOverlayState } from "@/app/util/socket";
import obs from "@/app/overlay/obs-socket";

import {
  OverlayFeature,
  OverlayTextPatternBackground
} from "./";


export default function OverlayMainWrapper({ children }: { children: React.ReactNode }) {
  const [initialSwitch, setInitialSwitch] = React.useState<boolean>(false);
  const [sceneSwitchInterval, setSceneSwitchInterval] = React.useState<ReturnType<typeof setInterval> | undefined>(undefined);
  const [currentScene, setCurrentScene] = React.useState<IOverlayState["currentScene"] | undefined>(undefined);
  const [currentDarkMode, setCurrentDarkMode] = React.useState<boolean | undefined>(undefined);
  const { state } = useHackathon();

  React.useEffect(() => {
    const newOverlayState = state?.overlay;
    if (!newOverlayState) return;

    if (currentScene?.scene !== newOverlayState.currentScene.scene) {
      void switchScene(newOverlayState.currentScene);
      setCurrentScene(newOverlayState.currentScene);
    }

    if (currentDarkMode !== newOverlayState.main.darkMode) {
      switchDarkMode(newOverlayState.main.darkMode);
      setCurrentDarkMode(newOverlayState.main.darkMode);
    }
  }, [state]);

  async function switchScene(options: { scene: string, countdown: number }) {
    const { scene: sceneName, countdown } = options;

    if (!initialSwitch) {
      await switchSceneTo(sceneName);
      setInitialSwitch(true);

      return;
    }

    if (!countdown) {
      document.querySelector(".text-pattern-bg .countdown")!.textContent = "";

      classList(".text-pattern-bg").add("animate-in-out");

      if (sceneName.startsWith("Recording")) {
        await waitFor(5);
        await switchSceneTo(sceneName);
        await waitFor(3);
      } else {
        await waitFor(1.2);
        await switchSceneTo(sceneName);
        await waitFor(7);
      }

      classList(".text-pattern-bg").remove("animate-in-out");

      return;
    }

    classList(".text-pattern-bg").add("animate-in");

    let currentCountdown = countdown;
    document.querySelector(".text-pattern-bg .countdown")!.textContent = `${currentCountdown}`;

    let hasSwitchedScene = false;

    clearInterval(sceneSwitchInterval);
    const newSceneSwitchInterval = setInterval(async () => {
      if (!hasSwitchedScene && currentCountdown <= (sceneName.startsWith("Recording") ? 3 : 8)) {
        await switchSceneTo(sceneName);
        hasSwitchedScene = true;
      }

      if (currentCountdown <= 0) {
        clearInterval(sceneSwitchInterval);

        classList(".text-pattern-bg").remove("animate-in");
        classList(".text-pattern-bg").add("animate-out");

        // for resources-sake, removing this class will kill off the animation
        await waitFor(1);
        classList(".text-pattern-bg").remove("animate-out");
      }

      currentCountdown--;
      document.querySelector(".text-pattern-bg .countdown")!.textContent = `${currentCountdown}`;
    }, 1000);
    setSceneSwitchInterval(newSceneSwitchInterval);
  }

  async function switchSceneTo(sceneName: string) {
    console.log("now: " + sceneName);

    if (sceneName === "Default") {
      classList(".main-wrapper").remove("animate-out");
      classList(".main-wrapper").add("animate-in");

      classList(".gradient-bg").add("bg-" + Math.floor(Math.random() * 3));
    } else {
      classList(".main-wrapper").remove("animate-in");
      classList(".main-wrapper").add("animate-out");
    }

    await obs.call("SetCurrentProgramScene", { sceneName })
      .catch(console.error);
  }

  function switchDarkMode(darkMode: boolean) {
    if (darkMode === true) {
      classList(".main-wrapper").add("dark");
      return;
    }

    if (darkMode === false) {
      classList(".main-wrapper").remove("dark");
      return;
    }
    console.error("Invalid dark mode setting provided.");
  }

  return (
    <>
      <div className="main-wrapper dark">
        <div className="gradient-bg"/>
        <div className="main">
          {children}
        </div>
        <OverlayFeature />
      </div>
      <OverlayTextPatternBackground/>
    </>
  );
}
