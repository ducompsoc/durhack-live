import TokenType from "@/auth/token-type"
import { z } from "zod"

export const listenOptionsSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
})

export const databaseOptionsSchema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  database: z.string(),
  username: z.string(),
  password: z.string(),
})

export const cookieOptionsSchema = z.object({
  sameSite: z.union([z.literal("none"), z.literal("lax"), z.literal("strict")]).optional(),
  path: z.string().optional(),
  secure: z.boolean(),
})

export const doubleCsrfOptionsSchema = z.object({
  cookieOptions: cookieOptionsSchema.extend({
    name: z.string().optional(),
    signed: z.boolean().optional(),
  }),
})

export const sessionOptionsSchema = z.object({
  name: z.string(),
  signingSecret: z.string(),
  cookie: cookieOptionsSchema,
})

export const discordOptionsSchema = z.object({
  apiEndpoint: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
  inviteLink: z.string().url(),
})

const rsaTokenAuthoritySchema = z.object({
  for: z.nativeEnum(TokenType),
  algorithm: z.literal("rsa"),
  publicKeyFilePath: z.string(),
  privateKeyFilePath: z.string(),
})

const hsaTokenAuthoritySchema = z.object({
  for: z.nativeEnum(TokenType),
  algorithm: z.literal("hsa"),
  secret: z.string(),
})

export const tokenAuthoritySchema = z.union([rsaTokenAuthoritySchema, hsaTokenAuthoritySchema])

export type TokenAuthorityConfig = z.infer<typeof tokenAuthoritySchema>

export const jwtOptionsSchema = z.object({
  issuer: z.string().url(),
  audience: z.string().url(),
  authorities: z.array(tokenAuthoritySchema),
})

export const oauthOptionsSchema = z.object({
  accessTokenLifetime: z.number().positive(),
  refreshTokenLifetime: z.number().positive(),
  allowEmptyState: z.boolean(),
  allowExtendedTokenAttributes: z.boolean(),
  useErrorHandler: z.boolean(),
  continueMiddleware: z.boolean(),
})

export const keycloakOptionsSchema = z.object({
  url: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUris: z.array(z.string()),
  responseTypes: z.array(z.union([
    z.literal("code"),
    z.literal("token"),
    z.literal("id_token"),
    z.literal("none"),
  ])),
})

export const configSchema = z.object({
  listen: listenOptionsSchema,
  hostname: z.string().url(),
  flags: z.object({}),
  database: z.object({
    data: databaseOptionsSchema,
    session: databaseOptionsSchema,
  }),
  csrf: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    options: doubleCsrfOptionsSchema,
  }),
  cookieParser: z.object({
    secret: z.string(),
  }),
  jsonwebtoken: jwtOptionsSchema,
  oauth: oauthOptionsSchema,
  session: sessionOptionsSchema,
  discord: discordOptionsSchema,
  keycloak: keycloakOptionsSchema,
  hackathonStateSocket: z.object({
    clientSecret: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>
export type ConfigIn = z.input<typeof configSchema>
