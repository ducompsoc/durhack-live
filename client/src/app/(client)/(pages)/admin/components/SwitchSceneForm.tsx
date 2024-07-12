"use client";
import React from "react";
import { Field } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";


const scenes = ["Default", "Feed A", "Feed B", "Feed C", "Recording A", "Recording B", "Recording C"];

const SwitchSceneContent = React.memo(() => {
  return (
    <>
      <h3>Switch Scene</h3>

      <p>You should check the feed is healthy before you switch to one. Specifying no countdown results in an instant transition.</p>

      <Segment className="row">
        <Label>Scene:</Label>
        <div>
          <Field as="select" className="dh-input" name="scene">
            {scenes.map(value => <option value={value} key={value}>{value}</option>)}
          </Field>
        </div>
      </Segment>

      <Segment className="row">
        <Label>Seconds:</Label>
        <div><Field type="number" className="dh-input" name="countdown" min="0" step="1" /></div>
      </Segment>

      <Segment className="row">
        <Label>Music on:</Label>
        <div><Field type="checkbox" className="dh-check" name="music" /></div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

const SwitchScene = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["currentScene"]) {
    if (!hackathon) return;
    pushHackathon({ ...hackathon, overlay: { ...hackathon.overlay, currentScene: values } });
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.currentScene} handleSubmit={handleSubmit}>
      <SwitchSceneContent />
    </OverlayForm>
  );
});

export default SwitchScene;
