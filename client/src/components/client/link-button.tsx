"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const LinkButton = ({ className, primary, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { primary?: boolean }) => {
  return <a
    className={cn("link-button", primary ? "primary" : "", className)}
    {...props}
  />
}
