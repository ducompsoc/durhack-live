"use client";

import { cn } from "@/lib/utils";

export const ContentContainer = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div
    className={cn("md:max-w-[1200px] mx-auto", className)}
    {...props}
  />
}
