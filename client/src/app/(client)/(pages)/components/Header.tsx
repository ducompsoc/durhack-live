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

const Navbar = styled.div`
  background: linear-gradient(
    88deg,
    #020316 0%,
    #3c2f62 32%,
    rgba(60, 163, 189, 0.85) 80%,
    #707b89 100%
  );
  @media (min-width: 768px) {
    background: linear-gradient(
      88deg,
      #020316 0%,
      #3c2f62 16.67%,
      rgba(60, 163, 189, 0.85) 34.38%,
      #707b89 50%,
      rgba(205, 52, 44, 0.76) 72.4%,
      #e37f60 99.99%
    );
`;

const Header = React.memo(() => (
  <Navbar>
    <HeaderInner>
      <ContentContainer className="row">
        <LogoWrapper className="column center">
          <p className="font-heading text-5xl md:text-7xl text-white ml-6 xl:m-0">
            DURHACK
          </p>
        </LogoWrapper>
        <div className="grow basis-0" />
        <Countdown />
      </ContentContainer>
    </HeaderInner>
  </Navbar>
));

export default Header;
