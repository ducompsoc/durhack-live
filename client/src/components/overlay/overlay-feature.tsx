"use client"

import isEqual from "lodash/isEqual"
import * as React from "react"

import { DynamicFaIcon } from "@/components/dynamic-fa-icon"
import { type IOverlayState, useHackathon } from "@/lib/socket"
import { waitFor } from "@/lib/utils"

export function OverlayFeature() {
  const { state } = useHackathon()
  const [lastFeature, setLastFeature] = React.useState<IOverlayState["feature"] | null>(null)
  const [featureTitle, setFeatureTitle] = React.useState<string | null>(state?.overlay.feature.title || null)
  const [featureIcon, setFeatureIcon] = React.useState<string | null>(state?.overlay.feature.icon || null)
  const [featureText, setFeatureText] = React.useState<string | null>(state?.overlay.feature.text || null)
  const featureContainerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    void onHackathonStateChange()
  }, [state])

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay
    if (!newOverlayState) return

    if (!isEqual(lastFeature, newOverlayState.feature)) {
      setLastFeature(newOverlayState.feature)
      void updateFeature(newOverlayState.feature)
    }
  }

  async function animateOutFeature() {
    const featureContainer = featureContainerRef.current
    if (!featureContainer) return

    // the feature container is already animated out; do nothing
    if (!featureContainer.classList.contains("animate-in")) return

    featureContainer.classList.remove("animate-in")
    featureContainer.classList.add("animate-out")
    await waitFor(2)
    featureContainer.classList.remove("animate-out") // performance
  }

  async function updateFeature(feature: IOverlayState["feature"]): Promise<void> {
    const { enabled, icon, title, text } = feature

    await animateOutFeature()

    if (!enabled) return

    setFeatureIcon(icon)
    setFeatureText(text)
    setFeatureTitle(title)

    const featureContainer = featureContainerRef.current
    if (!featureContainer) return
    featureContainer.classList.add("animate-in")
  }

  return (
    <div className="feature" ref={featureContainerRef}>
      <div className="icon-bg" />

      <div className="cover">
        <div>
          <div className="icon">
            <DynamicFaIcon iconClassName={featureIcon ?? ""} />
          </div>

          <div className="title">{featureTitle}</div>

          <div className="text">{featureText}</div>
        </div>
      </div>
    </div>
  )
}
