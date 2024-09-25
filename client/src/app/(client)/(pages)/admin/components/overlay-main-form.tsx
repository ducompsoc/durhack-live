"use client"

import { type ArrayHelpers, Field, FieldArray, useFormikContext } from "formik"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IOverlayState, pushHackathon } from "@/lib/socket"

import { DefaultButtons, Label, OverlayForm, Segment } from "./"

const MainContent = React.memo(() => {
  const formik = useFormikContext<IOverlayState["main"]>()

  return (
    <>
      <h3>Default screen</h3>

      <Segment className="row">
        <Label>Dark Mode:</Label>
        <div>
          <Field type="checkbox" className="dh-check" name="darkMode" />
        </div>
      </Segment>

      <h4>Next up</h4>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div>
          <Field type="checkbox" className="dh-check" name="nextUp.enabled" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Pre-text:</Label>
        <div>
          <Field type="text" className="dh-input" name="nextUp.pretext" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div>
          <Field type="text" className="dh-input" name="nextUp.text" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>When:</Label>
        <div>
          <Field type="text" className="dh-input" name="nextUp.when" />
        </div>
      </Segment>

      <h4>Additional slides</h4>

      <p>New lines and paragraphs are permitted. Any blank slides will be ignored.</p>

      <FieldArray
        name="slides"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {formik.values.slides.map((_, index) => (
              <div className="row" key={index}>
                <div className="grow basis-0">
                  <Field as="textarea" className="dh-input" name={`slides.${index}`} rows="5" />
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
              className="plain-btn"
              onClick={() => arrayHelpers.insert(formik.values.slides.length, "")}
            >
              + Add Slide
            </button>
          </Segment>
        )}
      />

      <DefaultButtons />
    </>
  )
})

export const MainForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as IOverlayState["main"]
    if (!hackathon) return
    pushHackathon({ ...hackathon, overlay: { ...hackathon.overlay, main: values } })
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.main} handleSubmit={handleSubmit}>
      <MainContent />
    </OverlayForm>
  )
})
