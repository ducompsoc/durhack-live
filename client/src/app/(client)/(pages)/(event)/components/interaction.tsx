"use client";

import * as React from "react";

import { useHackathon } from "@/lib/socket";
import { LinkButton } from "@/components/client/link-button";
import { cn } from "@/lib/utils";

const InteractionContainer = ({children, className, ...props}: React.HTMLAttributes<HTMLDivElement>): React.ReactNode => {
  return <div className={cn("h-[68px] box-border py-3 px-4 mt-1", className)} {...props}>
    {children}
  </div>
}

const LargerText = ({children, className, ...props}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactNode => {
  return <p className={cn("text-xl pb-0.5", className)} {...props}>
    {children}
  </p>
}

const EmphasisedText = ({children, className, ...props}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactNode => {
  return <p className={cn("text-xl font-bold", className)} {...props}>
    {children}
  </p>
}

const DefaultInteraction = () => {
  return (
    <InteractionContainer className="row center">
      <div className="grow basis-0">
        <LargerText>Welcome to the DurHack livestream.</LargerText>
      </div>
    </InteractionContainer>
  );
}

export const Interaction = React.memo(() => {
  const hackathon = useHackathon();

  if (!hackathon.state) return <DefaultInteraction />
  const liveLink = hackathon.state.schedule.find(event => event.state === "in_progress" && event.onStream)?.liveLink;

  if (!liveLink) return <DefaultInteraction />

  if (liveLink.startsWith("#")) {
    return (
      <InteractionContainer className="row center">
        <div className="grow basis-0">
          <LargerText>Discuss this event in the <strong>{liveLink}</strong> channel in Discord.</LargerText>
        </div>
      </InteractionContainer>
    );
  }

  return (
    <InteractionContainer className="row center">
      <div className="grow basis-0">
        <p>You&apos;re currently watching a livestream of a Zoom workshop.</p>
        <EmphasisedText>Join Zoom if you want to interact with this workshop.</EmphasisedText>
      </div>

      <div>
        <LinkButton href={liveLink} target="_blank">Join Zoom session</LinkButton>
      </div>
    </InteractionContainer>
  );
});
