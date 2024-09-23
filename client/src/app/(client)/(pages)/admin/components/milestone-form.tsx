"use client";

import * as React from "react";
import { Field } from "formik";

import { IOverlayState, pushHackathon } from "@/lib/socket";
import { HackathonContext } from "@/lib/hackathon-context";
import { formatDateLocal } from "@/lib/utils";

import { Segment, Label, OverlayForm, DefaultButtons } from "./";

const MilestoneContent = React.memo(() => {
  return (
    <>
      <h3>Milestone</h3>

      <p>
        This is the countdown that shows in the bottom right of the Default
        scene.
      </p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div>
          <Field type="checkbox" className="dh-check" name="enabled" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div>
          <Field type="text" className="dh-input" name="text" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Ends at:</Label>
        <div>
          <Field name="when">
            {({ field }: { field: any }) => (
              <div>
                <input type="datetime-local" className="dh-input" {...field} value={formatDateLocal(field.value)} />
              </div>
            )}
          </Field>
        </div>
      </Segment>

      <DefaultButtons />
    </>
  );
});

export const Milestone = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["milestone"]) {
    if (!hackathon) return;
    values.when = values.when ? (new Date(values.when)).toISOString() : "";
    pushHackathon({
      ...hackathon,
      overlay: { ...hackathon.overlay, milestone: values },
    });
  }

  return (
    <OverlayForm
      initialValues={hackathon.overlay.milestone}
      handleSubmit={handleSubmit}
    >
      <MilestoneContent />
    </OverlayForm>
  );
});
