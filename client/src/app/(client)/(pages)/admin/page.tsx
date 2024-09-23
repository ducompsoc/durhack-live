"use client"

import { Card } from "@durhack/web-components/ui/card"
import * as React from "react"

import { Section } from "@/components/client/section"
import { useHackathon } from "@/lib/socket"

import { HackathonContext } from "@/lib/hackathon-context"
import {
  AnnouncementForm,
  FeatureForm,
  LowerThirdForm,
  MainForm,
  MilestoneForm,
  ScheduleForm,
  SwitchSceneForm,
  TipsForm,
  UpperThirdForm,
  YoutubeForm,
} from "./components"

export default React.memo(() => {
  const hackathon = useHackathon()

  if (!hackathon.connected || !hackathon.state) {
    return <main>Not connected.</main>
  }

  if (hackathon.role !== "admin") {
    return <main>You do not have permission to view this page.</main>
  }

  return (
    <HackathonContext.Provider value={hackathon.state}>
      <main>
        <Section>
          <div>
            <Card>
              This admin page controls both content on this website, and what shows on the livestream. Changes take
              effect immediately after you hit Submit.
            </Card>
          </div>

          <div className="row">
            <Card className="grow basis-0">
              <AnnouncementForm />
            </Card>
            <Card className="grow basis-0">
              <TipsForm />
            </Card>
          </div>

          <div>
            <Card>
              <ScheduleForm />
            </Card>
          </div>

          <div className="row">
            <Card className="grow basis-0">
              <MainForm />
            </Card>
            <Card className="grow basis-0">
              <LowerThirdForm />
              <UpperThirdForm />
            </Card>
          </div>

          <div className="row">
            <Card className="grow basis-0">
              <SwitchSceneForm />
            </Card>
            <Card className="grow basis-0">
              <MilestoneForm />
            </Card>
            <Card className="grow basis-0">
              <FeatureForm />
            </Card>
          </div>

          <div>
            <Card className="grow basis-0">
              <YoutubeForm />
            </Card>
          </div>
        </Section>
      </main>
    </HackathonContext.Provider>
  )
})
