"use client";
import * as React from "react";
import { Field } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";


const FeatureContent = React.memo(() => {
  return (
    <>
      <h3>Feature</h3>

      <p>This is a special, persistent announcement that shows over the top of the Default scene.</p>

      <p>Icon should be a Font Awesome 5 class.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" className="dh-check" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Title:</Label>
        <div><Field type="text" className="dh-input" name="title" /></div>
      </Segment>

      <Segment className="row">
        <Label>Icon:</Label>
        <div><Field type="text" className="dh-input" name="icon" placeholder="e.g. fab fa-slack-hash" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field as="textarea" className="dh-input" name="text" rows="5" /></div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

const Feature = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["feature"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, feature: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.feature} handleSubmit={handleSubmit}>
      <FeatureContent />
    </OverlayForm>
  );
});

export default Feature;
