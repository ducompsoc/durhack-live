import React from 'react';
import styled from 'styled-components';

import { Card } from '../common/Card';
import { Section } from '../common/Section';

const SocialOptionButton = styled.a`
	position: relative;
	width: 25%;
	color: #fff;
	text-decoration: none;
	padding: 32px 18px;

	&:before {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 100%;
		left: 0px;
		content: '';
		background-color: ${p => p.theme.primaryLight};
		transition: .5s ease;
	}

	&:hover:before {
		bottom: 0px;
	}
`;

const SocialOptionButtonInner = styled.span`
	position: relative;
`;

const SocialOptionButtonPreText = styled.div`
	font-size: 14px;
	font-weight: bold;
	text-transform: uppercase;
`;

const SocialOptionButtonText = styled.div`
	font-size: 28px;
`;

const SocialOptionIcon = styled.div`
	font-size: 48px;
	margin-right: 16px;
`;

interface ISocialOptionProps {
	href: string;
	icon: string;
	pretext: string;
	text: string;
}

const SocialOption = React.memo(({
	href, icon, pretext, text,
}: ISocialOptionProps) => (
	<SocialOptionButton href={href} target="_blank" rel="noopener">
		<SocialOptionButtonInner className="row center">
			<SocialOptionIcon><span className={icon} /></SocialOptionIcon>
			<div>
				<SocialOptionButtonPreText>{pretext}</SocialOptionButtonPreText>
				<SocialOptionButtonText>{text}</SocialOptionButtonText>
			</div>
		</SocialOptionButtonInner>
	</SocialOptionButton>
));

export const Socials = React.memo(() => (
	<Section>
		<div>
			<Card className="row" noPadding>
				<SocialOption
					href="https://durhack.com/slack"
					icon="fab fa-slack-hash"
					pretext="Chat to hackers on"
					text="Slack"
				/>

				<SocialOption
					href="https://facebook.com/DurHackEvent"
					icon="fab fa-facebook"
					pretext="Like us on Facebook"
					text="/DurHackEvent"
				/>

				<SocialOption
					href="https://instagram.com/DurHack.Events"
					icon="fab fa-instagram"
					pretext="Tag us on Instagram"
					text="@DurHack.Events"
				/>

				<SocialOption
					href="https://twitter.com/DurHackEvent"
					icon="fab fa-twitter"
					pretext="Mention us on Twitter"
					text="@DurHackEvent"
				/>
			</Card>
		</div>
	</Section>
));
