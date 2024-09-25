"use client"

import { Card } from "@durhack/web-components/ui/card"
import * as React from "react"

import { Schedule } from "@/components/client/schedule"
import { Section } from "@/components/client/section"

export const HackerPack = React.memo(() => (
  <Section>
    <Card>
      <Schedule />
    </Card>
  </Section>
))
