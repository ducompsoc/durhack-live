import * as React from 'react';
import styled from 'styled-components';

import { useHackathon } from '../../util/socket';
import { Card } from '../common/Card';
import { LinkButton } from '../common/LinkButton';
import { Section } from '../common/Section';

const AnnouncementContainer = styled(Card)`
	border-left: solid 4px #C5E3B3;
`;

const AnnouncementTitle = styled.h2`
	font-size: 36px;
	color: #C5E3B3;
	margin: 0px;
`;

const AnnouncementText = styled.div`
	padding: 9px 0px;
`;

/* eslint-disable react/no-array-index-key */
export const Announcement = React.memo(() => {
	const { state } = useHackathon();

	if (!state || !state.announcement.enabled) {
		return <></>;
	}

	const { announcement } = state;

	return (
		<Section>
			<AnnouncementContainer>
				<AnnouncementTitle>{state.announcement.title}</AnnouncementTitle>
				<AnnouncementText>
					{announcement.text.split('\n').map((line, index) => <div key={index}>{line || <>&nbsp;</>}</div>)}
				</AnnouncementText>
				{announcement.buttonLink && (
					<LinkButton href={announcement.buttonLink} target="_blank" rel="noopener" primary>{announcement.buttonText}</LinkButton>
				)}
			</AnnouncementContainer>
		</Section>
	);
});
