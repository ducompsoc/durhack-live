"use client"

import isEqual from "lodash/isEqual"
import * as React from "react"

import { useCountdown } from "@/hooks/use-countdown"
import { type IOverlayState, useHackathon } from "@/lib/socket"
import { waitFor, zeroPad } from "@/lib/utils"

function digitise(num: string) {
  return num.split("").map((char, index) => (
    <span className="digit" key={index}>
      {char}
    </span>
  ))
}

function MilestoneCountdown(props: { hours: number; minutes: number; seconds: number }) {
  const { hours, minutes, seconds } = props

  const Sep = () => <span className="sep">:</span>

  return (
    <>
      {digitise(zeroPad(hours))}
      <Sep />
      {digitise(zeroPad(minutes))}
      <Sep />
      {digitise(zeroPad(seconds))}
    </>
  )
}

export function OverlayMilestone() {
  const { state } = useHackathon()
  const [lastMilestone, setLastMilestone] = React.useState<IOverlayState["milestone"] | null>(
    state?.overlay.milestone || null,
  )
  const [milestoneWhen, setMilestoneWhen] = React.useState<Date>(() => {
    if (!state?.overlay.milestone.when) return new Date()
    return new Date(state.overlay.milestone.when)
  })
  const [milestoneText, setMilestoneText] = React.useState<string | null>(null)
  const milestoneCountdownValues = useCountdown(milestoneWhen)
  const milestoneContainerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    void onHackathonStateChange()
  }, [state])

  async function onHackathonStateChange() {
    const newOverlayState = state?.overlay
    if (!newOverlayState) return

    if (!isEqual(lastMilestone, newOverlayState.milestone)) {
      setLastMilestone(newOverlayState.milestone)
      const newMilestoneWhen = new Date(newOverlayState.milestone.when)
      void updateMilestoneNow(newOverlayState.milestone.enabled, newOverlayState.milestone.text, newMilestoneWhen)
    }
  }

  async function animateOutMilestone() {
    const milestoneContainer = milestoneContainerRef.current
    if (!milestoneContainer) return

    // the milestone container is already animated out; do nothing
    if (!milestoneContainer.classList.contains("animate-in")) return

    milestoneContainer.classList.remove("animate-in")
    milestoneContainer.classList.add("animate-out")
    await waitFor(1)
    milestoneContainer.classList.remove("animate-out")
  }

  async function updateMilestoneNow(enabled: boolean, text: string, when: Date): Promise<void> {
    await animateOutMilestone()

    if (!enabled) return

    setMilestoneWhen(when)
    setMilestoneText(text)

    const milestoneContainer = milestoneContainerRef.current
    if (!milestoneContainer) return
    milestoneContainer.classList.add("animate-in")
  }

  return (
    <div className="milestone" ref={milestoneContainerRef}>
      <div className="text">{milestoneText}</div>
      <div className="countdown">
        <MilestoneCountdown {...milestoneCountdownValues} />
      </div>
    </div>
  )
}
