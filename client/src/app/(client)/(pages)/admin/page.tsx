"use client";

import {
  Field, FieldArray, ArrayHelpers, Form, Formik, useFormikContext, FormikValues,
} from "formik";
import React from "react";
import styled from "styled-components";
import pick from "lodash/pick";

import { IHackathonState, IOverlayState, pushHackathon, useHackathon } from "@/app/util/socket";

import Card from "../components/Card";
import Section from "../components/Section";

/* eslint-disable react/no-array-index-key */

const scenes = ["Default", "Feed A", "Feed B", "Feed C", "Recording A", "Recording B", "Recording C"];

const Segment = styled.div`
	margin: 12px 0;

	> div {
		width: 100%;

		input {
			box-sizing: border-box;

			&[type=text], &[type=number] {
				width: 100%;
			}
		}

		select, textarea {
			width: 100%;
			box-sizing: border-box;
		}
	}
`;

const Label = styled.div`
	width: 33% !important;
`;

const Buttons = styled.div`
	text-align: right;
`;

const Table = styled.table`
	width: 100%;

	th, td {
		text-align: left;
		padding: 2px;
	}

	input {
		width: 100%;
		box-sizing: border-box;
	}
`;

interface IOverlayFormProps {
  initialValues: FormikValues;
  handleSubmit: any;
	children: React.ReactNode;
}

const HackathonContext = React.createContext<IHackathonState | null>(null);

const DefaultOverlayFormButtons = React.memo(() => {
  const formik = useFormikContext();

  return (
    <Buttons>
      <button type="button" onClick={formik.handleReset} disabled={!formik.dirty}>Reset</button>{" "}
      <button type="submit" disabled={!formik.dirty}>Submit</button>
    </Buttons>
  );
});


const OverlayForm = React.memo(({
  initialValues, handleSubmit, children
}: IOverlayFormProps) => {

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form>
        {children}
      </Form>
    </Formik>
  );
});

const SwitchSceneContent = React.memo(() => {
  return (
    <>
      <h3>Switch Scene</h3>

      <p>You should check the feed is healthy before you switch to one. Specifying no countdown results in an instant transition.</p>

      <Segment className="row">
        <Label>Scene:</Label>
        <div>
          <Field as="select" name="scene">
            {scenes.map(value => <option value={value} key={value}>{value}</option>)}
          </Field>
        </div>
      </Segment>

      <Segment className="row">
        <Label>Seconds:</Label>
        <div><Field type="number" name="countdown" min="0" step="1" /></div>
      </Segment>

      <Segment className="row">
        <Label>Music on:</Label>
        <div><Field type="checkbox" name="music" /></div>
      </Segment>

      <DefaultOverlayFormButtons />
    </>
  );
});

const SwitchScene = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["currentScene"]) {
    if (!hackathon) return;
    pushHackathon({ ...hackathon, overlay: { ...hackathon.overlay, currentScene: values } });
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.currentScene} handleSubmit={handleSubmit}>
      <SwitchSceneContent />
    </OverlayForm>
  );
});

const MilestoneContent = React.memo(() => {
  return (
    <>
      <h3>Milestone</h3>

      <p>This is the countdown that shows in the bottom right of the Default scene.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="text" /></div>
      </Segment>

      <Segment className="row">
        <Label>Ends at:</Label>
        <div><Field type="text" name="when" /></div>
      </Segment>

      <DefaultOverlayFormButtons />
    </>
  );
});

const Milestone = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["milestone"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, milestone: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.milestone} handleSubmit={handleSubmit}>
      <MilestoneContent />
    </OverlayForm>
  );
});

const FeatureContent = React.memo(() => {
  return (
    <>
      <h3>Feature</h3>

      <p>This is a special, persistent announcement that shows over the top of the Default scene.</p>

      <p>Icon should be a Font Awesome 5 class.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Title:</Label>
        <div><Field type="text" name="title" /></div>
      </Segment>

      <Segment className="row">
        <Label>Icon:</Label>
        <div><Field type="text" name="icon" placeholder="e.g. fab fa-slack-hash" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field as="textarea" name="text" rows="5" /></div>
      </Segment>

      <DefaultOverlayFormButtons />
    </>
  );
});

const Feature = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["feature"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, feature: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.feature} handleSubmit={handleSubmit}>
      <FeatureContent />
    </OverlayForm>
  );
});

const MainContent = React.memo(() => {
  const formik = useFormikContext<IOverlayState["main"]>();

  return (
    <>
      <h3>Default screen</h3>

      <Segment className="row">
        <Label>Dark Mode:</Label>
        <div><Field type="checkbox" name="darkMode" /></div>
      </Segment>

      <h4>Next up</h4>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="nextUp.enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Pre-text:</Label>
        <div><Field type="text" name="nextUp.pretext" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="nextUp.text" /></div>
      </Segment>

      <Segment className="row">
        <Label>When:</Label>
        <div><Field type="text" name="nextUp.when" /></div>
      </Segment>

      <h4>Additional slides</h4>

      <p>New lines and paragraphs are permitted. Any blank slides will be ignored.</p>

      <FieldArray
        name="slides"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {(formik.values.slides).map((_, index) => (
              <div className="row" key={index}>
                <div className="flex">
                  <Field as="textarea" name={`slides.${index}`} rows="5" />
                </div>
                <div>
                  <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" onClick={() => arrayHelpers.insert(index, "")}>+</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => arrayHelpers.insert(formik.values.slides.length, "")}>+ Add Slide</button>
          </Segment>
        )}
      />

      <DefaultOverlayFormButtons />
    </>
  );
});

const Main = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["main"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, main: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.main} handleSubmit={handleSubmit}>
      <MainContent />
    </OverlayForm>
  );
});

const LowerThirdContent = React.memo(() => {
  const formik = useFormikContext();
  const hackathon = React.useContext(HackathonContext);

  if (!hackathon) return <></>;

  const disableSubmit = hackathon.overlay.lowerThird.managedBy === "admin" && !formik.dirty;

  return (
    <>
      <h3>Lower Third</h3>

      <p>This is a message that shows at the bottom of a feed. This will never show on the Default scene. Icon is optional.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Icon:</Label>
        <div><Field type="text" name="icon" placeholder="e.g. fab fa-slack-hash" /></div>
      </Segment>

      <Segment className="row">
        <Label>Pre-text:</Label>
        <div><Field type="text" name="pretext" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="text" /></div>
      </Segment>

      <Segment className="row">
        <Label>Countdown until:</Label>
        <div><Field type="text" name="when" /></div>
      </Segment>

      <Buttons>
        <button type="button" onClick={formik.handleReset} disabled={!formik.dirty}>Reset</button>{" "}
        <button type="submit" disabled={disableSubmit}>Submit</button>
      </Buttons>
    </>
  );
});

const LowerThird = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["lowerThird"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, lowerThird: {...values, managedBy: "admin" }}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.lowerThird} handleSubmit={handleSubmit}>
      <LowerThirdContent />
    </OverlayForm>
  );
});

const UpperThirdContent = React.memo(() => {
  return (
    <>
      <h3>Upper Third</h3>

      <p>Behaves similarly, except this shows in the top left.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field type="text" name="text" /></div>
      </Segment>

      <DefaultOverlayFormButtons />
    </>
  );
});

const UpperThird = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IOverlayState["upperThird"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, overlay: {...hackathon.overlay, upperThird: values}});
  }

  return (
    <OverlayForm initialValues={hackathon.overlay.upperThird} handleSubmit={handleSubmit}>
      <UpperThirdContent />
    </OverlayForm>
  );
});

const YoutubeContent = React.memo(() => {
  const formik = useFormikContext<IOverlayState["youtube"]>();

  return (
    <>
      <h3>YouTube</h3>

      <p>DANGER ZONE: these controls are not intuitive at all; please don&apos;t touch without asking @ethan first.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Skipped:</Label>
        <div><Field type="number" name="skipped" /></div>
      </Segment>

      <FieldArray
        name="queue"
        render={(arrayHelpers: ArrayHelpers) => (
          <Segment>
            {(formik.values.queue).map((_, index) => (
              <div className="row" key={index}>
                <div className="flex">
                  <Field type="text" name={`queue.${index}.id`} placeholder="YouTube ID (not the full URL)" />
                </div>
                <div className="flex">
                  <Field type="text" name={`queue.${index}.lowerThird`} placeholder="Lower third" />
                </div>
                <div>
                  <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                  <button type="button" onClick={() => arrayHelpers.insert(index, { id: "", lowerThird: "" })}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => arrayHelpers.insert(formik.values.queue.length, { id: "", lowerThird: "" })}
            >
              + Add Video
            </button>
          </Segment>
        )}
      />

      <DefaultOverlayFormButtons />
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

      <DefaultOverlayFormButtons />
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

const AnnouncementContent = React.memo(() => {
  return (
    <>
      <h3>Announcement</h3>

      <p>This message shows just below socials on the website.</p>

      <Segment className="row">
        <Label>Enabled:</Label>
        <div><Field type="checkbox" name="enabled" /></div>
      </Segment>

      <Segment className="row">
        <Label>Title:</Label>
        <div><Field type="text" name="title" /></div>
      </Segment>

      <Segment className="row">
        <Label>Text:</Label>
        <div><Field as="textarea" name="text" rows={6} /></div>
      </Segment>

      <Segment className="row">
        <Label>Button text (optional):</Label>
        <div><Field type="text" name="buttonText" /></div>
      </Segment>

      <Segment className="row">
        <Label>Button link (optional):</Label>
        <div><Field type="text" name="buttonLink" /></div>
      </Segment>

      <DefaultOverlayFormButtons />
    </>
  );
});

const Announcement = React.memo(() => {
  const hackathon = React.useContext(HackathonContext);
  if (!hackathon) return <></>;

  function handleSubmit(values: IHackathonState["announcement"]) {
    if (!hackathon) return;
    pushHackathon({...hackathon, announcement: values});
  }

  return (
    <OverlayForm initialValues={hackathon.announcement} handleSubmit={handleSubmit}>
      <AnnouncementContent />
    </OverlayForm>
  );
});

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

export default React.memo(() => {
  const hackathon = useHackathon();

  if (!hackathon.connected || !hackathon.state) {
    return <main>Not connected.</main>;
  }

  if (hackathon.role !== "admin") {
    return <main>You do not have permission to view this page.</main>;
  }

  return (
    <HackathonContext.Provider value={hackathon.state}>
      <main>
        <Section>
          <div>
            <Card>
              This admin page controls both content on this website, and what shows on the livestream.{" "}
              Please ask @ethan on Slack if you have any questions. Changes take effect immediately after you hit Submit.
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <Announcement />
            </Card>
            <Card className="flex">
              <Tips />
            </Card>
          </div>

          <div>
            <Card>
              <Schedule />
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <Main />
            </Card>
            <Card className="flex">
              <LowerThird />
              <UpperThird />
            </Card>
          </div>

          <div className="row">
            <Card className="flex">
              <SwitchScene />
            </Card>
            <Card className="flex">
              <Milestone />
            </Card>
            <Card className="flex">
              <Feature />
            </Card>
          </div>

          <div>
            <Card className="flex">
              <YouTube />
            </Card>
          </div>
        </Section>
      </main>
    </HackathonContext.Provider>
  );
});
