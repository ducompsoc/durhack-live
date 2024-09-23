"use client";

import * as React from "react";
import { Card } from "@durhack/web-components/ui/card";

import { Section } from "@/components/client/section";
import { DiscordIcon, FacebookIcon, InstagramIcon, XIcon } from "@/components/icons";
import "@/styles/socials.css"

interface ISocialOptionProps {
	href: string;
	icon: React.FC<React.HTMLAttributes<SVGElement>>;
	pretext: string;
	text: string;
}

const SocialOption = React.memo(({
  href, icon: Icon, pretext, text,
}: ISocialOptionProps) => (
  <a className="social-button" href={href} target="_blank" rel="noopener">
    <span className="relative row">
      <Icon className="w-16 h-16 mr-4"/>
      <div>
        <div className="text-[14px] f">{pretext}</div>
        <div className="text-[28px]">{text}</div>
      </div>
    </span>
  </a>
));

export const Socials = React.memo(() => (
  <Section>
    <div>
      <Card className="flex flex-col md:flex-row gap-4 !p-0 !pl-6 !py-4 md:!py-6 md:!px-4" style={{justifyContent: "space-evenly"}}>
        <SocialOption
          href="/api/auth/discord"
          icon={DiscordIcon}
          pretext="Chat to others on"
          text="Discord"
        />

        <SocialOption
          href="https://facebook.com/DurHackEvent"
          icon={FacebookIcon}
          pretext="Like us on Facebook"
          text="/DurHackEvent"
        />

        <SocialOption
          href="https://instagram.com/DurHackEvent"
          icon={InstagramIcon}
          pretext="Tag us on Instagram"
          text="@DurHackEvent"
        />

        <SocialOption
          href="https://twitter.com/DurHackEvent"
          icon={XIcon}
          pretext="Mention us on X"
          text="@DurHackEvent"
        />
      </Card>
    </div>
  </Section>
));
