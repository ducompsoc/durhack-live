"use client"

import { Field } from "formik"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IOverlayState, pushHackathon } from "@/lib/socket"

import { DefaultButtons, Label, OverlayForm, Segment } from "./"

const UpperThirdContent = React.memo(() => {
  return (
    <>
      <h3>Upper Third</h3>

      <p>Behaves similarly, except this shows in the top left.</p>

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

      <DefaultButtons />
    </>
  )
})

export const UpperThirdForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as IOverlayState["upperThird"]
    if (!hackathon) return
    pushHackathon({ ...hackathon, overlay: { ...hackathon.overlay, upperThird: values } })
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.upperThird} handleSubmit={handleSubmit}>
      <UpperThirdContent />
    </OverlayForm>
  )
})
