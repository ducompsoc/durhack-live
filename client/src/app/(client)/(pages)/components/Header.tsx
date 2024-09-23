"use client";

import * as React from "react";
import styled from "styled-components";

import ContentContainer from "@/app/(client)/components/ContentContainer";

import Countdown from "./Countdown";

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
    <div className="md:pt-[64px] pt-4">
      <ContentContainer className="flex md:flex-row flex-col">
        <div className="md:flex md:flex-col center mb-6 mt-2 md:mt-0">
          <object data="/logo.svg" type="image/svg+xml" className="md:h-32 w-full">
            <p className="font-heading text-5xl md:text-7xl text-white ml-6 xl:m-0">
              DURHACK
            </p>
          </object>
        </div>
        <div className="md:grow md:basis-0" />
        <Countdown />
      </ContentContainer>
    </div>
  </Navbar>
));

export default Header;
