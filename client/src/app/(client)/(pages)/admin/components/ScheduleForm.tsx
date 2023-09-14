"use client";
import React from "react";
import { Field, FieldArray, ArrayHelpers, useFormikContext } from "formik";
import pick from "lodash/pick";

import { IHackathonState, pushHackathon } from "@/app/util/socket";

import { HackathonContext } from "../util";
import { Table, OverlayForm, DefaultButtons } from "./";

const ScheduleContent = React.memo(() => {
  const formik = useFormikContext<Pick<IHackathonState, "schedule">>();

  console.log("Schedule: ");
  console.log(formik.values);

  const newItem = {
    name: "",
    icon: "",
    start: "",
    end: "",
    liveLink: "",
    recordingLink: "",
    state: "scheduled",
    onStream: false,
  };

  return (
    <>
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
                {(formik.values.schedule).map((_, index) => (
                  <tr key={index}>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.name`} />
                    </td>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.icon`} style={{ width: 90 }} />
                    </td>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.start`} />
                    </td>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.end`} />
                    </td>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.liveLink`} style={{ width: 90 }} />
                    </td>
                    <td className="flex">
                      <Field type="text" name={`schedule.${index}.recordingLink`} style={{ width: 90 }} />
                    </td>
                    <td className="flex">
                      <Field as="select" name={`schedule.${index}.state`}>
                        <option value="scheduled">Scheduled</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </Field>
                    </td>
                    <td className="flex">
                      <Field type="checkbox" name={`schedule.${index}.onStream`} />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                    >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.insert(index, { ...newItem })}
                    >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.move(index, Math.max(0, index - 1))}
                    >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => arrayHelpers.move(index, index + 1)}
                    >
                        &darr;
                      </button>
                    </td>
                  </tr>
              ))}
                <tr>
                  <td>
                    <button
                      type="button"
                      onClick={() => arrayHelpers.insert(formik.values.schedule.length, { ...newItem })}
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
    </>
  );
});

const Schedule = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: Pick<IHackathonState, "schedule">) {
    if (!hackathon) return;
    pushHackathon({...hackathon, schedule: values.schedule});
  }

  return (
    <OverlayForm initialValues={pick(hackathon, "schedule")} handleSubmit={handleSubmit}>
      <ScheduleContent />
    </OverlayForm>
  );
});

export default Schedule;
