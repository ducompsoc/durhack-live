import { tokenVaultOptionsSchema } from "@durhack/token-vault/config-schema"
import { z } from "zod"

export const listenOptionsSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
})

export const cookieOptionsSchema = z.object({
  sameSite: z.enum(["none", "lax", "strict"]).nullish(),
  path: z.string().nullish(),
  secure: z.boolean(),
  domain: z.string().nullish(),
})

export const doubleCsrfOptionsSchema = z.object({
  cookieOptions: cookieOptionsSchema.extend({
    name: z.string().optional(),
  }),
})

export const sessionOptionsSchema = z.object({
  cookie: cookieOptionsSchema.extend({
    name: z.string().optional(),
  }),
})

export const discordOptionsSchema = z.object({
  apiEndpoint: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  inviteLink: z.string().url(),
})

export const keycloakOptionsSchema = z.object({
  realm: z.string(),
  baseUrl: z.string().url(),
  adminBaseUrl: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUris: z.array(z.string()),
  responseTypes: z.array(z.union([z.literal("code"), z.literal("token"), z.literal("id_token"), z.literal("none")])),
})

export const configSchema = z.object({
  listen: listenOptionsSchema,
  origin: z.string().url(),
  flags: z.object({}),
  csrf: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    options: doubleCsrfOptionsSchema,
  }),
  cookieSigning: z.object({
    secret: z.string(),
  }),
  jsonwebtoken: tokenVaultOptionsSchema,
  session: sessionOptionsSchema,
  discord: discordOptionsSchema,
  keycloak: keycloakOptionsSchema,
  hackathonStateSocket: z.object({
    clientSecret: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>
export type ConfigIn = z.input<typeof configSchema>
