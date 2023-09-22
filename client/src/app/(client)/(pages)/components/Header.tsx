"use client";

import React from "react";
import styled from "styled-components";

import ContentContainer from "@/app/(client)/components/ContentContainer";

import Countdown from "./Countdown";

const HeaderInner = styled.div`
	padding: 64px 0px 0px 0px;
`;

const LogoWrapper = styled.div`
	margin: 16px 0px;
`;

const Header = React.memo(() => (
  <div className="bg-accent">
    <HeaderInner>
      <ContentContainer className="row">
        <LogoWrapper className="column center">
          <p className="font-heading text-7xl text-white">DURHACK</p>
        </LogoWrapper>
        <div className="grow basis-0" />
        <Countdown />
      </ContentContainer>
    </HeaderInner>
  </div>
));

export default Header;
