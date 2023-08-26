"use client";
import React from "react";
import { Field } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";


const UpperThirdContent = React.memo(() => {
  return (
    <>
      <h3>Upper Third</h3>

      <p>Behaves similarly, except this shows in the top left.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="text" /></div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

const UpperThird = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["upperThird"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, upperThird: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.upperThird} handleSubmit={handleSubmit}>
      <UpperThirdContent />
    </OverlayForm>
  );
});

export default UpperThird;
