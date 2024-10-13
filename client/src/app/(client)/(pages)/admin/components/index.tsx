import type * as React from "react"

import { cn } from "@/lib/utils"

export * from "./default-buttons"
export * from "./overlay-form"
export * from "./switch-scene-form"
export * from "./milestone-form"
export * from "./feature-form"
export * from "./overlay-main-form"
export * from "./lower-third-form"
export * from "./upper-third-form"
export * from "./youtube-form"
export * from "./schedule-form"
export * from "./announcement-form"
export * from "./tips-form"

export const Segment = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("segment", className)} {...props} />
}

export const Label = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("label flex items-center pr-2", className)} {...props} />
}

export const Buttons = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("buttons", className)} {...props} />
}

export const Table = ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => {
  return <table className={cn("table", className)} {...props} />
}
