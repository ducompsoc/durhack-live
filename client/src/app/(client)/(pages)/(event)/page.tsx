"use client";

import React from "react";

import Announcement from "./components/Announcement";
import HackerPack from "./components/HackerPack";
import Socials from "./components/Socials";
import Stage from "./components/Stage";
import MainWebsiteLink from "./components/MainWebsiteLink";

export default React.memo(() => (
  <main>
    <Stage />
    <Socials />
    <Announcement />
    <HackerPack />
    <MainWebsiteLink />

    <object
      className="rocket"
      type="image/svg+xml"
      data="/assets/graphics/rocket/rocket-combined.svg"
    >
      rocket
    </object>
  </main>
));
