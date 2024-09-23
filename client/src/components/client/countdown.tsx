"use client"

import * as React from "react"

import { useCountdown } from "@/hooks/use-countdown"
import { useHackathon } from "@/lib/socket"

function zeroPad(num: number): string {
  if (num < 10) {
    return `0${num}`
  }

  return `${num}`
}

function digitise(num: string) {
  return num.split("").map((char, index) => (
    <span className="inline-block w-[50px] text-center" key={index}>
      {char}
    </span>
  ))
}

export const Countdown = React.memo(() => {
  const { state } = useHackathon()
  const [milestoneWhen, setMilestoneWhen] = React.useState<Date>(() => {
    if (!state?.overlay.milestone.when) return new Date()
    return new Date(state.overlay.milestone.when)
  })
  const countdownValues = useCountdown(milestoneWhen, 500)

  React.useEffect(() => {
    if (!state) return

    setMilestoneWhen(new Date(state.overlay.milestone.when))
  }, [state])

  if (!state || !state.overlay.milestone.enabled || !countdownValues) {
    return <></>
  }

  return (
    <div className="text-white box-border p-0 pl-4 column center md:w-[33%] md:m-0 ml-4 mt-2">
      <div className="w-full column center grow basis-0">
        <div className="w-full text-2xl font-semibold uppercase mb-[-6px]">{state.overlay.milestone.text}</div>
        <div className="w-full text-[50px] ml-[-32px]">
          {digitise(zeroPad(countdownValues.hours))}:{digitise(zeroPad(countdownValues.minutes))}:
          {digitise(zeroPad(countdownValues.seconds))}
        </div>
      </div>
    </div>
  )
})
