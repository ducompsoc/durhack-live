"use client"

import { Card } from "@durhack/web-components/ui/card"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import * as React from "react"

import { LinkButton } from "@/components/client/link-button"
import { Section } from "@/components/client/section"
import { type IScheduledEvent, useHackathon } from "@/lib/socket"
import { cn } from "@/lib/utils"

import { DynamicFaIcon } from "@/components/dynamic-fa-icon"
import { Interaction } from "./interaction"

const LiveEventName = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("text-lg font-bold pt-[9px]", className)} {...props} />
}

const LiveEventIcon = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("w-8", className)} {...props} />
}

/* eslint-disable react/no-array-index-key */
const TopTip = React.memo(() => {
  const { state } = useHackathon()
  const [tip, setTip] = React.useState<string>()
  const lastPicked = React.useRef<number>(0)

  React.useEffect(() => {
    if (!state || !state.tips.length) {
      return () => {}
    }

    const delay = 120 * 1000

    if (Date.now() - lastPicked.current > delay) {
      setTip(state.tips[Math.floor(Math.random() * state.tips.length)])
      lastPicked.current = Date.now()
    }

    const interval = window.setInterval(() => {
      setTip(state.tips[Math.floor(Math.random() * state.tips.length)])
      lastPicked.current = Date.now()
    }, delay)

    return () => {
      window.clearInterval(interval)
    }
  }, [state])

  if (!tip) {
    return <></>
  }

  return (
    <div>
      {tip.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  )
})

export const Stage = React.memo(() => {
  const { state } = useHackathon()
  const [inProgressEvent, setInProgressEvent] = React.useState<IScheduledEvent | null>(null)
  const [upNext, setUpNext] = React.useState<IScheduledEvent | null>(null)
  const [onTheSide, setOnTheSide] = React.useState<IScheduledEvent | null>(null)
  const [upNextTimeToGo, setUpNextTimeToGo] = React.useState<string>("")

  React.useEffect(() => {
    if (!state) {
      return
    }

    const reversedSchedule = [...state.schedule].reverse()

    const inProgressEventIndex = reversedSchedule.findIndex((item) => item.state === "in_progress" && item.onStream)
    setInProgressEvent(inProgressEventIndex === -1 ? null : reversedSchedule[inProgressEventIndex])

    let scheduleAfterInProgress = state.schedule
    if (inProgressEventIndex !== -1) {
      scheduleAfterInProgress = state.schedule.slice(state.schedule.length - inProgressEventIndex)
    }

    setUpNext(scheduleAfterInProgress.find((item) => item.state === "scheduled") || null)
    setOnTheSide(state.schedule.find((item) => item.state === "in_progress" && !item.onStream) || null)
  }, [state])

  React.useEffect(() => {
    if (!upNext) {
      return
    }

    const startDate: Date = new Date(upNext.start)
    if (Number.isNaN(startDate.getTime())) {
      /* eslint-disable-line no-restricted-globals */
      setUpNextTimeToGo("")
      return
    }

    setUpNextTimeToGo(startDate >= new Date() ? formatDistanceToNow(startDate) : "a moment")
    const interval = window.setInterval(() => {
      setUpNextTimeToGo(startDate >= new Date() ? formatDistanceToNow(startDate) : "a moment")
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [upNext])

  if (!state) {
    return <></>
  }

  let nowPlayingEl: JSX.Element | undefined
  if (inProgressEvent) {
    nowPlayingEl = (
      <Card className="ml-[-9px]" style={{ color: "#1e1e1e" }}>
        <Card className="pl-[18px] text-white">
          <h3>Live now</h3>
          <LiveEventName className="row center">
            <LiveEventIcon>
              <DynamicFaIcon iconClassName={inProgressEvent.icon} />
            </LiveEventIcon>
            <div className="grow basis-0">{inProgressEvent.name}</div>
          </LiveEventName>
        </Card>
      </Card>
    )
  }

  let upNextEl: JSX.Element | undefined
  if (upNext) {
    let startDate: Date | null = new Date(upNext.start)
    if (Number.isNaN(startDate.getTime())) {
      /* eslint-disable-line no-restricted-globals */
      startDate = null
    }

    upNextEl = (
      <Card>
        <h3>Up next</h3>
        <LiveEventName className="row center">
          <LiveEventIcon>
            <DynamicFaIcon iconClassName={upNext.icon} />
          </LiveEventIcon>
          <div className="grow basis-0">{upNext.name}</div>
        </LiveEventName>
        <div className="pt-3 text-lg text-secondary row center">
          <LiveEventIcon>
            <DynamicFaIcon iconClassName="far fa-clock" />
          </LiveEventIcon>
          {startDate && (
            <div className="grow basis-0">
              {upNext.onStream ? "Live here" : "Takes place"} in {upNextTimeToGo}
            </div>
          )}
        </div>
      </Card>
    )
  }

  let onTheSideEl: JSX.Element | undefined
  if (onTheSide) {
    onTheSideEl = (
      <Card>
        <h3>Also live now</h3>
        <LiveEventName className="row center">
          <LiveEventIcon>
            <DynamicFaIcon iconClassName={onTheSide.icon} />
          </LiveEventIcon>
          <div className="grow basis-0">{onTheSide.name}</div>
        </LiveEventName>
        {onTheSide.liveLink && (
          <Card className="pt-4">
            <LinkButton href={onTheSide.liveLink} target="_blank" primary>
              Join Zoom session
            </LinkButton>
          </Card>
        )}
      </Card>
    )
  }

  const topTipEl = (
    <Card className="md:grow md:basis-0">
      <h3>Top tip</h3>
      <TopTip />
    </Card>
  )

  return (
    <Section className="flex items-start flex-row md:flex-row" style={{ marginBottom: 0 }}>
      <Card className="p-1 md:w-[66%]">
        <div className="bg-black md:h-[447px] h-[250px]">
          <iframe
            title="DurHack Livestream"
            src={`https://player.twitch.tv/?channel=durhack&parent=${window.location.host.split(":")[0]}`}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="0"
            allowFullScreen
          >
            Your browser does not support iframes.
          </iframe>
        </div>
        <Interaction />
      </Card>

      <div className="column md:w-[33%]">
        {nowPlayingEl}
        {onTheSideEl}
        {upNextEl}
        {(!nowPlayingEl || !onTheSideEl || !upNextEl) && topTipEl}
      </div>
    </Section>
  )
})
