"use client";

import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSync } from "@fortawesome/free-solid-svg-icons"

import { useHackathon } from "@/lib/socket";
import { ContentContainer } from "@/components/client/content-container";

export const ConnectionBar = React.memo(() => {
  const { connected } = useHackathon();

  if (connected) {
    return <></>;
  }

  return (
    <div className="fixed inset-x-0 top-0 py-[9px] z-[999] bg-accent text-white" style={{
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)"
    }}>
      <ContentContainer className="row center">
        <div className="leading-[0px] pr-[9px]">
          <FontAwesomeIcon icon={faSync} spin/>
        </div>
        <div className="grow basis-0">
          Connecting to DurHack. <span className="text-muted">Taking too long? Try a refresh, or ping an organiser on Slack.</span>
        </div>
      </ContentContainer>
    </div>
  );
});
