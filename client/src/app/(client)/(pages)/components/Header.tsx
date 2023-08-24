"use client";

import React from "react";
import styled from "styled-components";

import ContentContainer from "@/app/(client)/components/ContentContainer";

import Countdown from "./Countdown";


const HeaderContainer = styled.div`
	background-image: linear-gradient(45deg, #52216b, #ff0040);
`;

const HeaderInner = styled.div`
	padding: 64px 0px 0px 0px;
`;

const LogoWrapper = styled.div`
	margin: 16px 0px;
`;

const Logo = styled.img`
	width: auto;
	height: 100px;
`;

const Header = React.memo(() => (
  <HeaderContainer>
    <HeaderInner>
      <ContentContainer className="row">
        <LogoWrapper className="column center">
          <a href="/"><Logo src="/images/header-logo.png" alt="Logo" /></a>
        </LogoWrapper>
        <div className="flex" />
        <Countdown />
      </ContentContainer>
    </HeaderInner>
  </HeaderContainer>
));

export default Header;
