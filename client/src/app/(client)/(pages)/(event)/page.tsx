"use client";

import * as React from "react";

import { Announcement } from "./components/announcement";
import { HackerPack } from "./components/hacker-pack";
import { Socials } from "./components/socials";
import { Stage } from "./components/stage";
import { MainWebsiteLink } from "./components/main-website-link";

export default React.memo(() => (
  <main>
    <Stage />
    <Socials />
    <Announcement />
    <HackerPack />
    <MainWebsiteLink />
  </main>
));
