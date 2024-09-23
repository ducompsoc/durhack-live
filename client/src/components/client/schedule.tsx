"use client"

import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import format from "date-fns/format"
import * as React from "react"

import { type IScheduledEvent, useHackathon } from "@/lib/socket"
import "@/styles/schedule.css"
import { DynamicFaIcon } from "@/components/dynamic-fa-icon"

interface IAugmentedScheduledEvent extends IScheduledEvent {
  startDate?: Date
  endDate?: Date
}

export const Schedule = React.memo(() => {
  const { state } = useHackathon()

  const groups = React.useMemo(() => {
    if (!state) {
      return []
    }

    const scheduledItems = [...state.schedule]
    const elementsPerGroup = Math.min(6, Math.ceil(state.schedule.length / 3))
    const result: IAugmentedScheduledEvent[][] = []
    while (scheduledItems.length) {
      result.push(
        scheduledItems.splice(0, elementsPerGroup).map((event: IScheduledEvent) => {
          const startDate = new Date(event.start)
          const endDate = event.end ? new Date(event.end) : undefined

          /* eslint-disable-next-line no-restricted-globals */
          if (Number.isNaN(startDate.getTime()) || (endDate && Number.isNaN(endDate?.getTime()))) {
            return event
          }

          return { ...event, startDate, endDate }
        }),
      )
    }

    return result
  }, [state])

  return (
    <div className="py-0 px-6">
      <div className="timeline-container pt-6 md:pt-0">
        {groups.map((event_group, group_idx) => (
          <div className="group" key={group_idx}>
            {group_idx !== 0 && (
              <div className="bracket center column">
                <div className="day" />
              </div>
            )}

            <div className="flex flex-col md:flex-row set">
              {event_group.map((event, event_idx) => (
                <div className={`event ${event.state} md:py-[32px]`} key={event_idx}>
                  <div className="time">
                    {event.startDate ? format(event.startDate, "p").toLowerCase() : "--:--"}
                    {event.endDate && <> &ndash; {format(new Date(event.endDate), "p").toLowerCase()}</>}
                  </div>
                  <div className="line row center">
                    <div className="icon">
                      <DynamicFaIcon iconClassName={event.icon} />
                    </div>
                  </div>
                  <div className="h-[84px]">
                    <div className="title">{event.name}</div>
                    {event.state === "in_progress" && event.liveLink && !event.liveLink.startsWith("#") && (
                      <a className="play-button" href={event.liveLink} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faPlay} />
                        Join Zoom
                      </a>
                    )}
                    {event.state === "done" && event.recordingLink && (
                      <a className="play-button" href={event.recordingLink} target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={faPlay} />
                        {event.recordingLink.includes("youtube") ? "Watch back" : "Get resources"}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
