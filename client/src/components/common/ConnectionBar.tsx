import * as React from 'react';
import styled from 'styled-components';

import { useHackathon } from '../../util/socket';
import { ContentContainer } from './ContentContainer';

const ConnectionBarContainer = styled.div`
	position: fixed;
	top: 0px;
	right: 0px;
	left: 0px;
	background-color: #751C9E;
	box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
	padding: 9px 0px;
`;

const SpinnerContainer = styled.div`
	line-height: 0px;
	padding-right: 9px;
`;

const Muted = styled.span`
	color: #ccc;
`;

export const ConnectionBar = React.memo(() => {
	const { connected } = useHackathon();

	if (connected) {
		return <></>;
	}

	return (
		<ConnectionBarContainer>
			<ContentContainer className="row center">
				<SpinnerContainer>
					<span className="fas fa-sync fa-spin" />
				</SpinnerContainer>
				<div className="flex">
					Connecting to DurHack. <Muted>Taking too long? Try a refresh, or ping an organiser on Slack.</Muted>
				</div>
			</ContentContainer>
		</ConnectionBarContainer>
	);
});
