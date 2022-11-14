import React from 'react';
import styled from 'styled-components';
import { useHackathon } from '../../util/socket';
import { LinkButton } from '../common/LinkButton';

const InteractionContainer = styled.div`
	height: 68px;
	box-sizing: border-box;
	padding: 12px 16px;
	margin-top: 4px;

	p {
		margin: 0px;
	}
`;

const LargerText = styled.p`
	font-size: 20px;
	padding-bottom: 2px;
	color: white;
`;

const EmphasisedText = styled.p`
	font-size: 20px;
	font-weight: bold;
`;

export const Interaction = React.memo(() => {
	const hackathon = useHackathon();

	if (hackathon.state) {
		const liveLink = hackathon.state.schedule.find(event => event.state === 'in-progress' && event.onStream)?.liveLink;

		if (liveLink) {
			if (liveLink.startsWith('#')) {
				return (
					<InteractionContainer className="row center">
						<div className="flex">
							<LargerText>Discuss this event in the <strong>{liveLink}</strong> channel in Slack.</LargerText>
						</div>
					</InteractionContainer>
				);
			}

			return (
				<InteractionContainer className="row center">
					<div className="flex">
						<p>You&apos;re currently watching a livestream of a Zoom workshop.</p>
						<EmphasisedText>Join Zoom if you want to interact with this workshop.</EmphasisedText>
					</div>

					<div>
						<LinkButton href={liveLink} target="_blank">Join Zoom session</LinkButton>
					</div>
				</InteractionContainer>
			);
		}
	}

	return (
		<InteractionContainer className="row center">
			<div className="flex">
				<LargerText>Welcome to the DurHack livestream.</LargerText>
			</div>
		</InteractionContainer>
	);
});
