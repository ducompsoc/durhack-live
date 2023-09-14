"use client";
import React from "react";
import { Field } from "formik";

import { IHackathonState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";

const AnnouncementContent = React.memo(() => {
  return (
    <>
      <h3>Announcement</h3>

      <p>This message shows just below socials on the website.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Title:</Label>
        <div><Field type="text" name="title" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field as="textarea" name="text" rows={6} /></div>
      </Segment>

      <Segment className="row">
        <Label>Button text (optional):</Label>
        <div><Field type="text" name="buttonText" /></div>
      </Segment>

      <Segment className="row">
        <Label>Button link (optional):</Label>
        <div><Field type="text" name="buttonLink" /></div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

const Announcement = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IHackathonState["announcement"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, announcement: values});
  }

  return (
    <OverlayForm initialValues={hackathon.announcement} handleSubmit={handleSubmit}>
      <AnnouncementContent />
    </OverlayForm>
  );
});

export default Announcement;
