"use client"

import type * as React from "react"

import { cn } from "@/lib/utils"

export const Section = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("p-0 mt-0 mb-[18px]", className)} {...props} />
}
