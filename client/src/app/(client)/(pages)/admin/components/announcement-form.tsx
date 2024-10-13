"use client"
import { Field } from "formik"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IHackathonState, pushHackathon } from "@/lib/socket"

import { DefaultButtons, Label, OverlayForm, Segment } from "./"

export const AnnouncementContent = React.memo(() => {
  return (
    <div className="space-y-2">
      <h3>Announcement</h3>

      <p>This message shows just below socials on the website. Button text and button link is optional.</p>

      <Segment className="row">
        <Label className="center">Enabled:</Label>
        <div>
          <Field type="checkbox" className="dh-check" name="enabled" />
        </div>
      </Segment>

      <Segment className="row ">
        <Label className="flex items-center">Title:</Label>
        <div>
          <Field type="text" className="dh-input" name="title" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div>
          <Field as="textarea" className="dh-input" name="text" rows={6} />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Button text:</Label>
        <div>
          <Field type="text" className="dh-input" name="buttonText" />
        </div>
      </Segment>

      <Segment className="row">
        <Label>Button link:</Label>
        <div>
          <Field type="text" className="dh-input" name="buttonLink" />
        </div>
      </Segment>

      <DefaultButtons />
    </div>
  )
})

export const AnnouncementForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as IHackathonState["announcement"]
    if (!hackathon) return
    pushHackathon({ ...hackathon, announcement: values })
  }

  return (
    <OverlayForm initialValues={hackathon.announcement} handleSubmit={handleSubmit}>
      <AnnouncementContent />
    </OverlayForm>
  )
})
