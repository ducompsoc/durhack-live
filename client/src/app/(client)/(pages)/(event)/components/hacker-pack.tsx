"use client";

import * as React from "react";
import { Card } from "@durhack/web-components/ui/card"

import { Section } from "@/components/client/section";
import { Schedule } from "@/components/client/schedule";

export const HackerPack = React.memo(() => (
  <Section>
    <Card>
      <Schedule />
    </Card>
  </Section>
));
