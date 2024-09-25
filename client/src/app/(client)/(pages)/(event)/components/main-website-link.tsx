"use client"

import { Button } from "@durhack/web-components/ui/button"
import * as React from "react"

export const MainWebsiteLink = React.memo(() => (
  <div className="relative font-light text-center text-lg md:pt-[48px] pt-6 text-white">
    <h2>Meet your organisers, see our sponsors, and read the FAQs over on</h2>
    <Button variant="link" size="lg" asChild>
      <a href="https://durhack.com" target="_blank" rel="noreferrer">
        durhack.com
      </a>
    </Button>
  </div>
))
