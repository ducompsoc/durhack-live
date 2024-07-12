"use client";
import React from "react";
import { Field, useFormikContext } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, Buttons } from "./";

const LowerThirdContent = React.memo(() => {
  const formik = useFormikContext();
  const hackathon = React.useContext(HackathonContext);

  if (!hackathon) return <></>;

  const disableSubmit = hackathon.overlay.lowerThird.managedBy === "admin" && !formik.dirty;

  return (
    <>
      <h3>Lower Third</h3>

      <p>This is a message that shows at the bottom of a feed. This will never show on the Default scene. Icon is optional.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" className="dh-check" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Icon:</Label>
        <div><Field type="text" className="dh-input" name="icon" placeholder="e.g. fab fa-slack-hash" /></div>
      </Segment>

      <Segment className="row">
        <Label>Pre-text:</Label>
        <div><Field type="text" className="dh-input" name="pretext" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" className="dh-input" name="text" /></div>
      </Segment>

      <Segment className="row">
        <Label>Countdown until:</Label>
        <div><Field type="text" className="dh-input" name="when" /></div>
      </Segment>

      <Buttons>
        <button type="button" className="dh-btn" onClick={formik.handleReset} disabled={!formik.dirty}>Reset</button>{" "}
        <button type="submit" className="dh-btn" disabled={disableSubmit}>Submit</button>
      </Buttons>
    </>
  );
});

const LowerThird = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["lowerThird"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, lowerThird: {...values, managedBy: "admin" }}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.lowerThird} handleSubmit={handleSubmit}>
      <LowerThirdContent />
    </OverlayForm>
  );
});

export default LowerThird;
