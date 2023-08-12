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
	transition: .3s ease;

	&:before {
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 100%;
		left: 0px;
		content: '';
		background-color: ${p => p.theme.primaryDark};
		transition: .5s ease;
	}

	&:hover:before {
		bottom: 0px;
	}

	&:hover {
		color: #1e1e1e;
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
					href="/discord"
					icon="fab fa-discord"
					pretext="Chat to others on"
					text="Discord"
				/>

				<SocialOption
					href="https://facebook.com/DurHackEvent"
					icon="fab fa-facebook"
					pretext="Like us on Facebook"
					text="/DurHackEvent"
				/>

				<SocialOption
					href="https://instagram.com/DurHackEvent"
					icon="fab fa-instagram"
					pretext="Tag us on Instagram"
					text="@DurHackEvent"
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
