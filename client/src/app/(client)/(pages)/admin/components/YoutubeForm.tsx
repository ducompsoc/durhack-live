"use client";
import * as React from "react";
import { Field, FieldArray, ArrayHelpers, useFormikContext } from "formik";

import { IOverlayState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, Label, OverlayForm, DefaultButtons } from "./";

const YoutubeContent = React.memo(() => {
  const formik = useFormikContext<IOverlayState["youtube"]>();

  return (
    <>
      <h3>YouTube</h3>

      <p>DANGER ZONE: these controls are not intuitive at all; please don&apos;t touch without asking first.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" className="dh-check" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Skipped:</Label>
        <div><Field type="number" className="dh-input" name="skipped" /></div>
      </Segment>

      <FieldArray
        name="queue"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {(formik.values.queue).map((_, index) => (
              <div className="row" key={index}>
                <div className="grow basis-0">
                  <Field type="text" className="dh-input" name={`queue.${index}.id`} placeholder="YouTube ID (not the full URL)" />
                </div>
                <div className="grow basis-0">
                  <Field type="text" className="dh-input" name={`queue.${index}.lowerThird`} placeholder="Lower third" />
                </div>
                <div>
                  <button type="button" className="plain-btn mx-1" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" className="plain-btn" onClick={() => arrayHelpers.insert(index, { id: "", lowerThird: "" })}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="plain-btn"
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
