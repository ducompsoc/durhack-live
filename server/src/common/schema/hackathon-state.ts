import { z } from "zod"

enum ScheduledEventState {
  scheduled = "scheduled",
  in_progress = "in_progress",
  done = "done",
}

const optionalDatetimeString = z.string().datetime().or(z.literal(""))

const scheduledEventSchema = z.object({
  name: z.string(),
  icon: z.string(),
  liveLink: z.string().nullable(),
  recordingLink: z.string().nullable(),
  start: z.string().datetime(),
  end: optionalDatetimeString,
  state: z.nativeEnum(ScheduledEventState),
  onStream: z.boolean(),
})

const overlayStateSchema = z.object({
  currentScene: z.object({
    scene: z.string(),
    countdown: z.number(),
    music: z.boolean(),
  }),
  main: z.object({
    darkMode: z.boolean(),
    nextUp: z.object({
      enabled: z.boolean(),
      pretext: z.string(),
      text: z.string(),
      when: optionalDatetimeString,
    }),
    slides: z.array(z.string()),
  }),
  feature: z.object({
    enabled: z.boolean(),
    icon: z.string(),
    title: z.string(),
    text: z.string(),
  }),
  upperThird: z.object({
    enabled: z.boolean(),
    text: z.string(),
  }),
  lowerThird: z.object({
    enabled: z.boolean(),
    icon: z.string(),
    pretext: z.string(),
    text: z.string(),
    when: optionalDatetimeString,
    managedBy: z.literal("admin").or(z.literal("youtube")),
  }),
  milestone: z.object({
    enabled: z.boolean(),
    text: z.string(),
    when: z.string().datetime(),
  }),
  youtube: z.object({
    enabled: z.boolean(),
    queue: z.array(
      z.object({
        id: z.string(),
        lowerThird: z.string(),
      }),
    ),
    skipped: z.number(),
  }),
})

export const hackathonStateSchema = z.object({
  schedule: z.array(scheduledEventSchema),
  announcement: z.object({
    enabled: z.boolean(),
    title: z.string(),
    text: z.string(),
    buttonText: z.string(),
    buttonLink: z.string(),
  }),
  tips: z.array(z.string()),
  startedAt: z.string().datetime(),
  overlay: overlayStateSchema,
})

export type IHackathonState = z.infer<typeof hackathonStateSchema>
