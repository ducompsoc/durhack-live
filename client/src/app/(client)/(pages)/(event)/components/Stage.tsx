"use client";

import * as React from "react";
import styled from "styled-components";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { useHackathon, IScheduledEvent } from "@/app/util/socket";
import Card from "@/app/(client)/(pages)/components/Card";
import Section from "@/app/(client)/(pages)/components/Section";
import LinkButton from "@/app/(client)/(pages)/components/LinkButton";

import Interaction from "./Interaction";

const LiveCard = styled(Card)`
	padding: 4px;
`;

const LiveNowPlaying = styled(Card)`
	margin-left: -9px;
`;

const Player = styled.div`
	background-color: #000;
`;

const LiveNowPlayingInner = styled.div`
	padding-left: 18px;
	color: white;
`;

const LiveSidebar = styled.div``;

const LiveEventName = styled.div`
	font-size: 18px;
	font-weight: bold;
	padding-top: 9px;
`;

const LiveEventIcon = styled.div`
	span {
		width: 32px;
	}
`;

const LiveEventWhen = styled.div`
	font-size: 18px;
	color: ${p => p.theme.secondaryA};
	padding-top: 12px;
`;

const LiveEventButton = styled.div`
	padding-top: 16px;
`;

/* eslint-disable react/no-array-index-key */
const TopTip = React.memo(() => {
  const { state } = useHackathon();
  const [tip, setTip] = React.useState<string>();
  const lastPicked = React.useRef<number>(0);

  React.useEffect(() => {
    if (!state || !state.tips.length) {
      return () => {};
    }

    const delay = 120 * 1000;

    if (Date.now() - lastPicked.current > delay) {
      setTip(state.tips[Math.floor(Math.random() * state.tips.length)]);
      lastPicked.current = Date.now();
    }

    const interval = setInterval(() => {
      setTip(state.tips[Math.floor(Math.random() * state.tips.length)]);
      lastPicked.current = Date.now();
    }, delay);

    return () => {
      clearInterval(interval);
    };
  }, [state]);

  if (!tip) {
    return <></>;
  }

  return (
    <div>
      {tip.split("\n").map((line, index) => <p key={index}>{line}</p>)}
    </div>
  );
});

const Stage = React.memo(() => {
  const { state } = useHackathon();
  const [inProgressEvent, setInProgressEvent] = React.useState<IScheduledEvent | null>(null);
  const [upNext, setUpNext] = React.useState<IScheduledEvent | null>(null);
  const [onTheSide, setOnTheSide] = React.useState<IScheduledEvent | null>(null);
  const [upNextTimeToGo, setUpNextTimeToGo] = React.useState<string>("");

  React.useEffect(() => {
    if (!state) {
      return;
    }

    const reversedSchedule = [...state.schedule].reverse();

    const inProgressEventIndex = reversedSchedule.findIndex(item => item.state === "in_progress" && item.onStream);
    setInProgressEvent(inProgressEventIndex === -1 ? null : reversedSchedule[inProgressEventIndex]);

    let scheduleAfterInProgress = state.schedule;
    if (inProgressEventIndex !== -1) {
      scheduleAfterInProgress = state.schedule.slice(state.schedule.length - inProgressEventIndex);
    }

    setUpNext(scheduleAfterInProgress.find(item => item.state === "scheduled") || null);
    setOnTheSide(state.schedule.find(item => item.state === "in_progress" && !item.onStream) || null);
  }, [state]);

  React.useEffect(() => {
    if (!upNext) {
      return;
    }

    let startDate: Date = new Date(upNext.start);
    if (isNaN(startDate.getTime())) { /* eslint-disable-line no-restricted-globals */
      setUpNextTimeToGo("");
      return;
    }

    setUpNextTimeToGo(startDate >= new Date() ? formatDistanceToNow(startDate) : "a moment");
    const interval = setInterval(() => {
      setUpNextTimeToGo(startDate >= new Date() ? formatDistanceToNow(startDate) : "a moment");
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [upNext]);

  if (!state) {
    return <></>;
  }

  let nowPlayingEl: JSX.Element | undefined;
  if (inProgressEvent) {
    nowPlayingEl = (
      <LiveNowPlaying colour="primaryDark" style={{ color: "#1e1e1e" }}>
        <LiveNowPlayingInner>
          <h3>Live now</h3>
          <LiveEventName className="row center">
            <LiveEventIcon><span className={inProgressEvent.icon} /></LiveEventIcon>
            <div className="grow basis-0">{inProgressEvent.name}</div>
          </LiveEventName>
        </LiveNowPlayingInner>
      </LiveNowPlaying>
    );
  }

  let upNextEl: JSX.Element | undefined;
  if (upNext) {
    let startDate: Date | null = new Date(upNext.start);
    if (isNaN(startDate.getTime())) { /* eslint-disable-line no-restricted-globals */
      startDate = null;
    }

    upNextEl = (
      <Card>
        <h3>Up next</h3>
        <LiveEventName className="row center">
          <LiveEventIcon><span className={upNext.icon} /></LiveEventIcon>
          <div className="grow basis-0">{upNext.name}</div>
        </LiveEventName>
        <LiveEventWhen className="row center">
          <LiveEventIcon><span className="far fa-clock" /></LiveEventIcon>
          {startDate && (
            <div className="grow basis-0">
              {upNext.onStream ? "Live here" : "Takes place"} in{" "}
              {upNextTimeToGo}
            </div>
          )}
        </LiveEventWhen>
      </Card>
    );
  }

  let onTheSideEl: JSX.Element | undefined;
  if (onTheSide) {
    onTheSideEl = (
      <Card>
        <h3>Also live now</h3>
        <LiveEventName className="row center">
          <LiveEventIcon><span className={onTheSide.icon} /></LiveEventIcon>
          <div className="grow basis-0">{onTheSide.name}</div>
        </LiveEventName>
        {onTheSide.liveLink && (
          <LiveEventButton>
            <LinkButton href={onTheSide.liveLink} target="_blank" primary>Join Zoom session</LinkButton>
          </LiveEventButton>
        )}
      </Card>
    );
  }

  const topTipEl = (
    <Card className="md:grow md:basis-0">
      <h3>Top tip</h3>
      <TopTip />
    </Card>
  );

  return (
    <Section className="flex flex-col md:flex-row" style={{ marginBottom: 0 }}>
      <LiveCard $noPadding colour="primaryDark" className="md:w-[66%]">
        <Player className="md:h-[447px] h-[250px]">
          <iframe
            title="DurHack Livestream"
            src={`https://player.twitch.tv/?channel=durhack&parent=${window.location.host.split(":")[0]}`}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="0"
            allowFullScreen
          >
            Your browser does not support iframes.
          </iframe>
        </Player>
        <Interaction />
      </LiveCard>

      <LiveSidebar className="column md:w-[33%]">
        {nowPlayingEl}
        {onTheSideEl}
        {upNextEl}
        {(!nowPlayingEl || !onTheSideEl || !upNextEl) && topTipEl}
      </LiveSidebar>
    </Section>
  );
});

export default Stage;
