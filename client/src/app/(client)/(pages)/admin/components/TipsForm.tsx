"use client";
import React from "react";
import { Field, FieldArray, ArrayHelpers, useFormikContext } from "formik";
import pick from "lodash/pick";

import { IHackathonState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Segment, OverlayForm, DefaultButtons } from "./";

const TipsContent = React.memo(() => {
  const formik = useFormikContext<Pick<IHackathonState, "tips">>();

  return (
    <>
      <h3>Top Tips</h3>

      <p>
        One of these messages will show to the right of the livestream player on the website, if there&apos;s room.
        A random tip will be picked every 2 minutes.
      </p>

      <FieldArray
        name="tips"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {(formik.values.tips).map((_, index) => (
              <div className="row" key={index}>
                <div className="flex">
                  <Field as="textarea" name={`tips.${index}`} rows="5" />
                </div>
                <div>
                  <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" onClick={() => arrayHelpers.insert(index, "")}>+</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => arrayHelpers.insert(formik.values.tips.length, "")}>+ Add Tip</button>
          </Segment>
        )}
      />

      <DefaultButtons />
    </>
  );
});

const Tips = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: Pick<IHackathonState, "tips">) {
    if (!hackathon) return;
    pushHackathon({...hackathon, tips: values.tips});
  }

  return (
    <OverlayForm initialValues={pick(hackathon, "tips")} handleSubmit={handleSubmit}>
      <TipsContent />
    </OverlayForm>
  );
});

export default Tips;
