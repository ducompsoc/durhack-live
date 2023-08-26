"use client";
import React from "react";
import { Field } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";


const MilestoneContent = React.memo(() => {
  return (
    <>
      <h3>Milestone</h3>

      <p>This is the countdown that shows in the bottom right of the Default scene.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="text" /></div>
      </Segment>

      <Segment className="row">
        <Label>Ends at:</Label>
        <div><Field type="text" name="when" /></div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

const Milestone = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["milestone"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, milestone: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.milestone} handleSubmit={handleSubmit}>
      <MilestoneContent />
    </OverlayForm>
  );
});

export default Milestone;
