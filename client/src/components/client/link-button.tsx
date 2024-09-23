"use client"

import { cn } from "@/lib/utils"
import type * as React from "react"

export const LinkButton = ({
  className,
  primary,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { primary?: boolean }) => {
  return <a className={cn("link-button", primary ? "primary" : "", className)} {...props} />
}
