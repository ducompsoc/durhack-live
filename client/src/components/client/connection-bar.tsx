"use client"

import { faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as React from "react"

import { ContentContainer } from "@/components/client/content-container"
import { useHackathon } from "@/lib/socket"

export const ConnectionBar = React.memo(() => {
  const { connected } = useHackathon()

  if (connected) {
    return <></>
  }

  return (
    <div
      className="fixed inset-x-0 top-0 py-[9px] z-[999] bg-accent text-white"
      style={{
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
      }}
    >
      <ContentContainer className="row center">
        <div className="leading-[0px] pr-[9px]">
          <FontAwesomeIcon icon={faSync} spin />
        </div>
        <div className="grow basis-0">
          Connecting to DurHack.{" "}
          <span className="text-muted-foreground">Taking too long? Try a refresh, or ping an organiser on Slack.</span>
        </div>
      </ContentContainer>
    </div>
  )
})
