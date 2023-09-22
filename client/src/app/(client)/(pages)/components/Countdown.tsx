"use client";

import * as React from "react";
import styled from "styled-components";

import useCountdown from "@/app/util/countdownHook";
import { useHackathon } from "@/app/util/socket";

const Wrapper = styled.div`
	width: 33%;
	color: white;
	box-sizing: border-box;
	/* padding: 0px 32px 0px calc(32px + 16px); */
	padding: 0px 0px 0px 16px;
`;

const WrapperInner = styled.div`
	width: 100%;
	/* background: linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0));
	padding: 0px 32px; */
`;

const CountdownTitle = styled.div`
	width: 100%;
	font-size: 26px;
    font-weight: 600;
	text-transform: uppercase;
	margin-bottom: -6px;
`;

const CountdownContainer = styled.div`
	width: 100%;
	font-family: 'Audiowide', 'Exo 2', sans-serif;
	font-size: 64px;
`;

const CountdownDigit = styled.span`
	display: inline-block;
	width: 58px;
	text-align: center;
`;

function zeroPad(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return `${num}`;
}

function digitise(num: string) {
  return num.split("").map((char, index) => <CountdownDigit key={index}>{char}</CountdownDigit>);
}

const Countdown = React.memo(() => {
  const { state } = useHackathon();
  const [milestoneWhen, setMilestoneWhen] = React.useState<Date>(() => {
    if (!state?.overlay.milestone.when) return new Date();
    return new Date(state.overlay.milestone.when);
  });
  const countdownValues = useCountdown(milestoneWhen, 500);

  React.useEffect(() => {
    if (!state) return;

    setMilestoneWhen(new Date(state.overlay.milestone.when));

  }, [state]);

  if (!state || !state.overlay.milestone.enabled || !countdownValues) {
    return <></>;
  }

  return (
    <Wrapper className="column center">
      <WrapperInner className="column center grow basis-0">
        <CountdownTitle>{state.overlay.milestone.text}</CountdownTitle>
        <CountdownContainer>
          {digitise(zeroPad(countdownValues.hours))}
          :
          {digitise(zeroPad(countdownValues.minutes))}
          :
          {digitise(zeroPad(countdownValues.seconds))}
        </CountdownContainer>
      </WrapperInner>
    </Wrapper>
  );
});

export default Countdown;
