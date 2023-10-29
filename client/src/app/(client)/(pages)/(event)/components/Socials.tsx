"use client";

import React from "react";
import styled from "styled-components";

import Card from "@/app/(client)/(pages)/components/Card";
import Section from "@/app/(client)/(pages)/components/Section";

const SocialOptionButton = styled.a`
	position: relative;
	color: #fff;
	text-decoration: none;
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
    <SocialOptionButtonInner className="row">
      <SocialOptionIcon><span className={icon} /></SocialOptionIcon>
      <div>
        <SocialOptionButtonPreText>{pretext}</SocialOptionButtonPreText>
        <SocialOptionButtonText>{text}</SocialOptionButtonText>
      </div>
    </SocialOptionButtonInner>
  </SocialOptionButton>
));

const Socials = React.memo(() => (
  <Section>
    <div>
      <Card className="flex flex-col md:flex-row gap-4 !p-0 !pl-6 !py-4 md:!py-6 md:!px-4" style={{justifyContent: "space-evenly"}}>
        <SocialOption
          href="/api/auth/discord"
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
          icon="fab fa-x-twitter"
          pretext="Mention us on X"
          text="@DurHackEvent"
        />
      </Card>
    </div>
  </Section>
));

export default Socials;
