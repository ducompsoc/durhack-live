"use client"

import { type ArrayHelpers, Field, FieldArray, type FieldInputProps, useFormikContext } from "formik"
import pick from "lodash/pick"
import * as React from "react"

import { HackathonContext } from "@/lib/hackathon-context"
import { type IHackathonState, pushHackathon } from "@/lib/socket"
import { formatDateLocal } from "@/lib/utils"

import { DefaultButtons, OverlayForm, Table } from "./"

const ScheduleContent = React.memo(() => {
  const formik = useFormikContext<Pick<IHackathonState, "schedule">>()

  console.log("Schedule: ")
  console.log(formik.values)

  const newItem = {
    name: "",
    icon: "",
    start: "",
    end: "",
    liveLink: "",
    recordingLink: "",
    state: "scheduled",
    onStream: false,
  }

  return (
    <div>
      <h3>Schedule</h3>

      <p>This schedule solely affects what is shown on this website. It does not affect the livestream.</p>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Icon</th>
            <th>Start</th>
            <th>End</th>
            <th>Zoom/Slack</th>
            <th>YouTube</th>
            <th>State</th>
            <th>Stream</th>
          </tr>
        </thead>

        <tbody>
          <FieldArray
            name="schedule"
            render={(arrayHelpers: ArrayHelpers) => (
              <>
                {formik.values.schedule.map((_, index) => (
                  <tr key={index}>
                    <td className="grow basis-0">
                      <Field type="text" className="dh-input" name={`schedule.${index}.name`} />
                    </td>
                    <td className="grow basis-0">
                      <Field type="text" className="dh-input" name={`schedule.${index}.icon`} style={{ width: 90 }} />
                    </td>
                    <td className="grow basis-0">
                      <Field name={`schedule.${index}.start`}>
                        {({ field }: { field: FieldInputProps<Date> }) => (
                          <div>
                            <input
                              type="datetime-local"
                              className="dh-input"
                              {...field}
                              value={formatDateLocal(field.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </td>
                    <td className="grow basis-0">
                      <Field name={`schedule.${index}.end`}>
                        {({ field }: { field: FieldInputProps<Date> }) => (
                          <div>
                            <input
                              type="datetime-local"
                              className="dh-input"
                              {...field}
                              value={formatDateLocal(field.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </td>
                    <td className="grow basis-0">
                      <Field
                        type="text"
                        className="dh-input"
                        name={`schedule.${index}.liveLink`}
                        style={{ width: 90 }}
                      />
                    </td>
                    <td className="grow basis-0">
                      <Field
                        type="text"
                        className="dh-input"
                        name={`schedule.${index}.recordingLink`}
                        style={{ width: 90 }}
                      />
                    </td>
                    <td className="grow basis-0">
                      <Field as="select" className="dh-input" name={`schedule.${index}.state`}>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </Field>
                    </td>
                    <td className="flex gap-x-1 items-center">
                      <Field type="checkbox" className="dh-check mx-1" name={`schedule.${index}.onStream`} />
                      <button type="button" className="plain-btn" onClick={() => arrayHelpers.remove(index)}>
                        -
                      </button>
                      <button
                        type="button"
                        className="plain-btn"
                        onClick={() => arrayHelpers.insert(index, { ...newItem })}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="plain-btn"
                        onClick={() => arrayHelpers.move(index, Math.max(0, index - 1))}
                      >
                        &uarr;
                      </button>
                      <button type="button" className="plain-btn" onClick={() => arrayHelpers.move(index, index + 1)}>
                        &darr;
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <button
                      type="button"
                      className="plain-btn mb-2 mt-2"
                      onClick={() =>
                        arrayHelpers.insert(formik.values.schedule.length, {
                          ...newItem,
                        })
                      }
                    >
                      + Add Schedule item
                    </button>
                  </td>
                </tr>
              </>
            )}
          />
        </tbody>
      </Table>

      <DefaultButtons />
    </div>
  )
})

export const ScheduleForm = React.memo(() => {
  const hackathon = React.useContext(HackathonContext)
  if (!hackathon) return <></>

  function handleSubmit(_values: unknown) {
    const values = _values as Pick<IHackathonState, "schedule">
    if (!hackathon) return
    for (const item of values.schedule) {
      item.start = item.start ? new Date(item.start).toISOString() : ""
      item.end = item.end ? new Date(item.end).toISOString() : ""
    }
    pushHackathon({ ...hackathon, schedule: values.schedule })
  }

  return (
    <OverlayForm initialValues={pick(hackathon, "schedule")} handleSubmit={handleSubmit}>
      <ScheduleContent />
    </OverlayForm>
  )
})
