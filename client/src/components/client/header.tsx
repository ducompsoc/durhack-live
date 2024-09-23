"use client";

import * as React from "react";

import { ContentContainer } from "@/components/client/content-container";
import { Countdown } from "@/components/client/countdown";
import "@/styles/navbar.css"

export const Header = React.memo(() => (
  <nav className="navbar-gradient-background">
    <div className="md:pt-[64px] pt-4">
      <ContentContainer className="flex md:flex-row flex-col">
        <div className="md:flex md:flex-col center mb-6 mt-2 md:mt-0">
          <object data="/logo.svg" type="image/svg+xml" className="md:h-32 w-full">
            <p className="font-heading text-5xl md:text-7xl text-white ml-6 xl:m-0 uppercase">
              DurHack
            </p>
          </object>
        </div>
        <div className="md:grow md:basis-0" />
        <Countdown />
      </ContentContainer>
    </div>
  </nav>
));
