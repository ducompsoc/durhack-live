"use client";

import React from "react";

import { useHackathon } from "@/app/util/socket";

import Card from "../components/Card";
import Section from "../components/Section";
import { HackathonContext } from "./util";
import {
  AnnouncementForm,
  TipsForm,
  ScheduleForm,
  OverlayMainForm,
  LowerThirdForm,
  UpperThirdForm,
  SwitchSceneForm,
  MilestoneForm,
  FeatureForm,
  YoutubeForm,
} from "./components";


export default React.memo(() => {
  const hackathon = useHackathon();

  if (!hackathon.connected || !hackathon.state) {
    return <main>Not connected.</main>;
  }

  if (hackathon.role !== "admin") {
    return <main>You do not have permission to view this page.</main>;
  }

  return (
    <HackathonContext.Provider value={hackathon.state}>
      <main>
        <Section>
          <div>
            <Card>
              This admin page controls both content on this website, and what shows on the livestream.{" "}
              Changes take effect immediately after you hit Submit.
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
              <OverlayMainForm />
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
  );
});
