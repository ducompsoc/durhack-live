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
              Please ask @ethan on Slack if you have any questions. Changes take effect immediately after you hit Submit.
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <AnnouncementForm />
            </Card>
            <Card className="flex">
              <TipsForm />
            </Card>
          </div>

          <div>
            <Card>
              <ScheduleForm />
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <OverlayMainForm />
            </Card>
            <Card className="flex">
              <LowerThirdForm />
              <UpperThirdForm />
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <SwitchSceneForm />
            </Card>
            <Card className="flex">
              <MilestoneForm />
            </Card>
            <Card className="flex">
              <FeatureForm />
            </Card>
          </div>

          <div>
            <Card className="flex">
              <YoutubeForm />
            </Card>
          </div>
        </Section>
      </main>
    </HackathonContext.Provider>
  );
});
