"use client";

import * as React from "react";

import { Schedule } from "@/components/client/schedule";

export default React.memo(() => (
  <div className="w-screen h-screen flex flex-row align-center justify-center bg-background">
    <div className="w-screen box-border px-8">
      <Schedule />
    </div>
  </div>
));
