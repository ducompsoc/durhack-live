'use client';

import * as React from 'react';
import styled from 'styled-components';

import { useHackathon } from '@/app/(client)/util/socket';
import Card from '@/app/(client)/(pages)/components/Card';
import LinkButton from '@/app/(client)/(pages)/components/LinkButton';
import Section from '@/app/(client)/(pages)/components/Section';

const AnnouncementContainer = styled(Card)`
	border-left: solid 4px ${p => p.theme.secondaryA};
`;

const AnnouncementTitle = styled.h2`
	font-size: 36px;
	color: ${p => p.theme.secondaryA};
	margin: 0;
`;

const AnnouncementText = styled.div`
	padding: 9px 0;
`;

/* eslint-disable react/no-array-index-key */
const Announcement = React.memo(() => {
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

export default Announcement;
