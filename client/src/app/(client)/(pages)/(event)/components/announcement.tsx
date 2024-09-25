"use client"

import { Card } from "@durhack/web-components/ui/card"
import * as React from "react"

import { Section } from "@/components/client/section"
import { useHackathon } from "@/lib/socket"

/* eslint-disable react/no-array-index-key */
export const Announcement = React.memo(() => {
  const { state } = useHackathon()

  if (!state || !state.announcement.enabled) {
    return <></>
  }

  const { announcement } = state

  return (
    <Section>
      <Card className="border-l-4">
        <h2 className="text-3xl m-0">{state.announcement.title}</h2>
        <div className="py-2 mb-1">
          {announcement.text.split("\n").map((line, index) => (
            // biome-ignore lint/complexity/noUselessFragments: the fragment is not useless
            <div key={index}>{line || <>&nbsp;</>}</div>
          ))}
        </div>
        {announcement.buttonLink && (
          <a className="dh-btn" href={announcement.buttonLink} target="_blank" rel="noreferrer noopener">
            {announcement.buttonText}
          </a>
        )}
      </Card>
    </Section>
  )
})
