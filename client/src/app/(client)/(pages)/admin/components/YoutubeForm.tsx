"use client";
import React from "react";
import { Field, FieldArray, ArrayHelpers, useFormikContext } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";

const YoutubeContent = React.memo(() => {
  const formik = useFormikContext<IOverlayState["youtube"]>();

  return (
    <>
      <h3>YouTube</h3>

      <p>DANGER ZONE: these controls are not intuitive at all; please don&apos;t touch without asking @ethan first.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Skipped:</Label>
        <div><Field type="number" name="skipped" /></div>
      </Segment>

      <FieldArray
        name="queue"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {(formik.values.queue).map((_, index) => (
              <div className="row" key={index}>
                <div className="flex">
                  <Field type="text" name={`queue.${index}.id`} placeholder="YouTube ID (not the full URL)" />
                </div>
                <div className="flex">
                  <Field type="text" name={`queue.${index}.lowerThird`} placeholder="Lower third" />
                </div>
                <div>
                  <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" onClick={() => arrayHelpers.insert(index, { id: "", lowerThird: "" })}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => arrayHelpers.insert(formik.values.queue.length, { id: "", lowerThird: "" })}
            >
              + Add Video
            </button>
          </Segment>
        )}
      />

      <DefaultButtons />
    </>
  );
});

const YouTube = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["youtube"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, youtube: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.youtube} handleSubmit={handleSubmit}>
      <YoutubeContent />
    </OverlayForm>
  );
});

export default YouTube;
