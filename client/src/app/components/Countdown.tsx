'use client';

import * as React from 'react';
import styled from 'styled-components';

import { useHackathon } from '@/app/util/socket';

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
	font-size: 24px;
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
	return num.split('').map((char, index) => <CountdownDigit key={index}>{char}</CountdownDigit>);
}

const Countdown = React.memo(() => {
	const { state } = useHackathon();
	const [countdownValues, setCountdownValues] = React.useState<[number, number, number]>();

	const countdownTo = React.useMemo(() => {
		if (!state) {
			return null;
		}

		const millis = (state as any).milestoneMillis;
		if (millis === null) {
			return null;
		}

		return Date.now() + millis;
	}, [state]);

	React.useEffect(() => {
		if (!countdownTo) {
			return () => {};
		}

		const countdownToSeconds = Math.floor(countdownTo / 1000);
		const interval = setInterval(() => {
			const diffSeconds = Math.max(0, countdownToSeconds - Math.floor(Date.now() / 1000));
			const hours = Math.floor(diffSeconds / 3600);
			const minutes = Math.floor((diffSeconds - (hours * 3600)) / 60);
			const seconds = diffSeconds - (hours * 3600) - (minutes * 60);
			setCountdownValues([hours, minutes, seconds]);
		}, 500);

		return () => {
			clearInterval(interval);
		};
	}, [countdownTo]);

	if (!state || !state.overlay.milestone.enabled || !countdownValues) {
		return <></>;
	}

	return (
		<Wrapper className="column center">
			<WrapperInner className="column center flex">
				<CountdownTitle>{state.overlay.milestone.text}</CountdownTitle>
				<CountdownContainer>
					{digitise(zeroPad(countdownValues[0]))}
					:
					{digitise(zeroPad(countdownValues[1]))}
					:
					{digitise(zeroPad(countdownValues[2]))}
				</CountdownContainer>
			</WrapperInner>
		</Wrapper>
	);
});

export default Countdown;
