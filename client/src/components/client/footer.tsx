"use client"

import * as React from "react"

import { ContentContainer } from "@/components/client/content-container"

export const Footer = React.memo(() => (
  <div className="text-center text-white pb-16 pt-6">
    <ContentContainer>
      <p>
        DurHack follows the{" "}
        <a
          href="https://hackp.ac/coc"
          target="_blank"
          rel="noreferrer noopener"
          className="font-bold no-underline hover:underline"
        >
          MLH Code of Conduct
        </a>
        . If something goes wrong, please talk to an organiser.
      </p>
    </ContentContainer>
  </div>
))
