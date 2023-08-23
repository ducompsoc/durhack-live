'use client';

import {
  Field, FieldArray, ArrayHelpers, Form, Formik, FormikProps,
} from 'formik';
import React from 'react';
import styled from 'styled-components';

import { IHackathonState, pushHackathon, useHackathon } from '@/app/util/socket';
import Card from '@/app/components/Card';
import _Page from '@/app/components/_Page';
import Section from '@/app/components/Section';

/* eslint-disable react/no-array-index-key */

const scenes = ['Default', 'Feed A', 'Feed B', 'Feed C', 'Recording A', 'Recording B', 'Recording C'];

const Segment = styled.div`
	margin: 12px 0px;

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
	hackathon: IHackathonState;
	category?: string;
	kind?: string;
	children: ((props: FormikProps<any>) => React.ReactNode) | React.ReactNode
}

const OverlayForm = React.memo(({
  hackathon, category, kind, children,
}: IOverlayFormProps) => {
  category = category || 'overlay';

  const handleSubmit = React.useCallback((values: any) => {
    if (kind) {
      pushHackathon({ ...hackathon, [category]: { ...(hackathon as any)[category], [kind]: values } });
    } else {
      pushHackathon({ ...hackathon, ...values });
    }
  }, [hackathon, category, kind]);

  return (
    <Formik
      initialValues={kind ? (hackathon as any)[category][kind] : hackathon}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {props => (
        <Form>
          {typeof children === 'function' ? children(props) : children}

          <Buttons>
            <button type="button" onClick={props.handleReset} disabled={!props.dirty}>Reset</button>{' '}
            <button type="submit" disabled={!props.dirty}>Submit</button>
          </Buttons>
        </Form>
      )}
    </Formik>
  );
});

const SwitchScene = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="currentScene">
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
  </OverlayForm>
));

const Milestone = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="milestone">
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
  </OverlayForm>
));

const Feature = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="feature">
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
  </OverlayForm>
));

const Main = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="main">
    {props => (
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
              {(props.values.slides as string[]).map((_, index) => (
                <div className="row" key={index}>
                  <div className="flex">
                    <Field as="textarea" name={`slides.${index}`} rows="5" />
                  </div>
                  <div>
                    <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                    <button type="button" onClick={() => arrayHelpers.insert(index, '')}>+</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => arrayHelpers.insert(props.values.slides.length, '')}>+ Add Slide</button>
            </Segment>
          )}
        />
      </>
    )}
  </OverlayForm>
));

const LowerThird = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="lowerThird">
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
  </OverlayForm>
));

const UpperThird = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="upperThird">
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
  </OverlayForm>
));

const YouTube = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} kind="youtube">
    {props => (
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
              {(props.values.queue as string[]).map((_, index) => (
                <div className="row" key={index}>
                  <div className="flex">
                    <Field type="text" name={`queue.${index}.id`} placeholder="YouTube ID (not the full URL)" />
                  </div>
                  <div className="flex">
                    <Field type="text" name={`queue.${index}.lowerThird`} placeholder="Lower third" />
                  </div>
                  <div>
                    <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                    <button type="button" onClick={() => arrayHelpers.insert(index, { id: '', lowerThird: '' })}>
                      +
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => arrayHelpers.insert(props.values.queue.length, { id: '', lowerThird: '' })}
              >
                + Add Video
              </button>
            </Segment>
          )}
        />
      </>
    )}
  </OverlayForm>
));

const Schedule = React.memo(({ hackathon }: { hackathon: IHackathonState }) => {
  const newItem = {
    name: '',
    icon: '',
    start: '',
    end: '',
    liveLink: '',
    recordingLink: '',
    state: 'scheduled',
    onStream: false,
  };

  return (
    <OverlayForm hackathon={hackathon} category="schedule">
      {props => (
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
                    {(props.values.schedule as void[]).map((_, index) => (
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
                          onClick={() => arrayHelpers.insert(props.values.schedule.length, { ...newItem })}
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
        </>
      )}
    </OverlayForm>
  );
});

const Announcement = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} category="announcement">
    <h3>Announcement</h3>

    <p>This message shows just below socials on the website.</p>

    <Segment className="row">
      <Label>Enabled:</Label>
      <div><Field type="checkbox" name="announcement.enabled" /></div>
    </Segment>

    <Segment className="row">
      <Label>Title:</Label>
      <div><Field type="text" name="announcement.title" /></div>
    </Segment>

    <Segment className="row">
      <Label>Text:</Label>
      <div><Field as="textarea" name="announcement.text" rows={6} /></div>
    </Segment>

    <Segment className="row">
      <Label>Button text (optional):</Label>
      <div><Field type="text" name="announcement.buttonText" /></div>
    </Segment>

    <Segment className="row">
      <Label>Button link (optional):</Label>
      <div><Field type="text" name="announcement.buttonLink" /></div>
    </Segment>
  </OverlayForm>
));

const Tips = React.memo(({ hackathon }: { hackathon: IHackathonState }) => (
  <OverlayForm hackathon={hackathon} category="tips">
    {props => (
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
              {(props.values.tips as string[]).map((_, index) => (
                <div className="row" key={index}>
                  <div className="flex">
                    <Field as="textarea" name={`tips.${index}`} rows="5" />
                  </div>
                  <div>
                    <button type="button" onClick={() => arrayHelpers.remove(index)}>-</button>
                    <button type="button" onClick={() => arrayHelpers.insert(index, '')}>+</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => arrayHelpers.insert(props.values.tips.length, '')}>+ Add Tip</button>
            </Segment>
          )}
        />
      </>
    )}
  </OverlayForm>
));

export default React.memo(() => {
  const hackathon = useHackathon();

  if (!hackathon.connected) {
    return <_Page>Not connected.</_Page>;
  }

  if (hackathon.role !== 'admin') {
    return <_Page>You do not have permission to view this page.</_Page>;
  }

  return (
    <_Page>
      <Section>
        <div>
          <Card>
            This admin page controls both content on this website, and what shows on the livestream.{' '}
            Please ask @ethan on Slack if you have any questions. Changes take effect immediately after you hit Submit.
          </Card>
        </div>

        <div className="row">
          <Card className="flex">
            <Announcement hackathon={hackathon.state} />
          </Card>
          <Card className="flex">
            <Tips hackathon={hackathon.state} />
          </Card>
        </div>

        <div>
          <Card>
            <Schedule hackathon={hackathon.state} />
          </Card>
        </div>

        <div className="row">
          <Card className="flex">
            <Main hackathon={hackathon.state} />
          </Card>
          <Card className="flex">
            <LowerThird hackathon={hackathon.state} />
            <UpperThird hackathon={hackathon.state} />
          </Card>
        </div>

        <div className="row">
          <Card className="flex">
            <SwitchScene hackathon={hackathon.state} />
          </Card>
          <Card className="flex">
            <Milestone hackathon={hackathon.state} />
          </Card>
          <Card className="flex">
            <Feature hackathon={hackathon.state} />
          </Card>
        </div>

        <div>
          <Card className="flex">
            <YouTube hackathon={hackathon.state} />
          </Card>
        </div>
      </Section>
    </_Page>
  );
});
