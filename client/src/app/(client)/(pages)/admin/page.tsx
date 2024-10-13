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

  if (hackathon.authenticationLoading) {
    return <main>Waiting for authentication...</main>
  }

  if (!hackathon.roles?.includes("/admins")) {
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

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Card className="grow">
              <AnnouncementForm />
            </Card>
            <Card className="grow">
              <TipsForm />
            </Card>
          </div>

          <div className="hidden xl:block">
            <Card>
              <ScheduleForm />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Card className="grow">
              <MainForm />
            </Card>
            <Card className="grow">
              <LowerThirdForm />
              <div className="mt-4"></div>
              <UpperThirdForm />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            <Card className="grow">
              <SwitchSceneForm />
            </Card>
            <Card className="grow">
              <MilestoneForm />
            </Card>
            <Card className="grow">
              <FeatureForm />
            </Card>
          </div>

          <div>
            <Card className="grow">
              <YoutubeForm />
            </Card>
          </div>
        </Section>
      </main>
    </HackathonContext.Provider>
  )
})
