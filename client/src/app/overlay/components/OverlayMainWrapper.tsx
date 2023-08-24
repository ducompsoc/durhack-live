import React from "react";

import OverlayFeature from "./OverlayFeature";


export default function OverlayMainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-wrapper dark">
      <div className="gradient-bg"/>
      <div className="main">
        {children}
      </div>
      <OverlayFeature />
    </div>
  );
}
