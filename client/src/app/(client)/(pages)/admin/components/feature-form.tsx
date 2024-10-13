"use client"

import { Field } from "formik"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IOverlayState, pushHackathon } from "@/lib/socket"

import { DefaultButtons, Label, OverlayForm, Segment } from "./"

const FeatureContent = React.memo(() => {
  return (
    <div className="space-y-2">
      <h3>Feature</h3>

      <p>This is a special, persistent announcement that shows over the top of the Default scene.</p>

      <p>Icon should be a Font Awesome 5 class.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div>
          <Field type="checkbox" className="dh-check" name="enabled" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Title:</Label>
        <div>
          <Field type="text" className="dh-input" name="title" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Icon:</Label>
        <div>
          <Field type="text" className="dh-input" name="icon" placeholder="e.g. fab fa-slack-hash" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div>
          <Field as="textarea" className="dh-input" name="text" rows="5" />
        </div>
      </Segment>

      <DefaultButtons />
    </div>
  )
})

export const FeatureForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as IOverlayState["feature"]
    if (!hackathon) return
    pushHackathon({ ...hackathon, overlay: { ...hackathon.overlay, feature: values } })
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.feature} handleSubmit={handleSubmit}>
      <FeatureContent />
    </OverlayForm>
  )
})
