"use client";

import * as React from "react";
import styled from "styled-components";

import { useHackathon } from "@/app/util/socket";
import ContentContainer from "@/app/(client)/components/ContentContainer";

const ConnectionBarContainer = styled.div`
	position: fixed;
	top: 0px;
	right: 0px;
	left: 0px;
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

const ConnectionBar = React.memo(() => {
  const { connected } = useHackathon();

  if (connected) {
    return <></>;
  }

  return (
    <ConnectionBarContainer className="bg-accent text-white">
      <ContentContainer className="row center">
        <SpinnerContainer>
          <span className="fas fa-sync fa-spin" />
        </SpinnerContainer>
        <div className="grow basis-0">
          Connecting to DurHack. <Muted>Taking too long? Try a refresh, or ping an organiser on Slack.</Muted>
        </div>
      </ContentContainer>
    </ConnectionBarContainer>
  );
});

export default ConnectionBar;
