"use client"

import { type ArrayHelpers, Field, FieldArray, useFormikContext } from "formik"
import pick from "lodash/pick"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IHackathonState, pushHackathon } from "@/lib/socket"

import { DefaultButtons, OverlayForm, Segment } from "./"

const TipsContent = React.memo(() => {
  const formik = useFormikContext<Pick<IHackathonState, "tips">>()

  return (
    <div className="space-y-1">
      <h3>Top Tips</h3>

      <p>
        One of these messages will show to the right of the livestream player on the website, if there&apos;s room. A
        random tip will be picked every 2 minutes.
      </p>

      <FieldArray
        name="tips"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {formik.values.tips.map((_, index) => (
              <div className="row" key={index}>
                <div className="grow basis-0">
                  <Field as="textarea" className="dh-input" name={`tips.${index}`} rows="5" />
                </div>
                <div>
                  <button type="button" className="plain-btn mx-1" onClick={() => arrayHelpers.remove(index)}>
                    -
                  </button>
                  <button type="button" className="plain-btn" onClick={() => arrayHelpers.insert(index, "")}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="plain-btn mt-2"
              onClick={() => arrayHelpers.insert(formik.values.tips.length, "")}
            >
              + Add Tip
            </button>
          </Segment>
        )}
      />

      <DefaultButtons />
    </div>
  )
})

export const TipsForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as Pick<IHackathonState, "tips">
    if (!hackathon) return
    pushHackathon({ ...hackathon, tips: values.tips })
  }

  return (
    <OverlayForm initialValues={pick(hackathon, "tips")} handleSubmit={handleSubmit}>
      <TipsContent />
    </OverlayForm>
  )
})
