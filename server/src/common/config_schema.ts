import { z } from "zod";

export const listen_options_schema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
});

export const passport_local_options_schema = z.object({
  usernameField: z.string().optional(),
  passwordField: z.string().optional(),
  session: z.boolean().optional(),
  passReqToCallback: z.boolean().optional(),
});

export const passport_bearer_options_schema = z.object({
  realm: z.string().optional(),
  scope: z.string().optional(),
  passReqToCallback: z.boolean().optional(),
});

export const mysql_options_schema = z.object({
  host: z.string(),
  port: z.number().int().positive(),
  database: z.string(),
  user: z.string(),
  password: z.string(),
});

export const cookie_options_schema = z.object({
  sameSite: z.union([z.literal("none"), z.literal("lax"), z.literal("strict")]).optional(),
  path: z.string().optional(),
  secure: z.boolean(),
});

export const double_csrf_options_schema = z.object({
  cookieName: z.string(),
  cookieOptions: cookie_options_schema,
});

export const mailgun_options_schema = z.object({
  username: z.string(),
  key: z.string(),
  domain: z.string(),
  host: z.string(),
});

export const session_options_schema = z.object({
  name: z.string(),
  secret: z.string(),
  resave: z.boolean().optional(),
  saveUninitialized: z.boolean().optional(),
  cookie: cookie_options_schema,
});

export const discord_options_schema = z.object({
  apiEndpoint: z.string().url(),
  clientId: z.string(),
  clientSecret: z.string(),
  redirectUri: z.string().url(),
});

export const config_schema = z.object({
  listen: listen_options_schema,
  flags: z.object({
    skipEmailVerification: z.boolean(),
  }),
  passport: z.object({
    local: passport_local_options_schema,
    bearer: passport_bearer_options_schema,
  }),
  mysql: z.object({
    data: mysql_options_schema,
    session: mysql_options_schema,
  }),
  csrf: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    options: double_csrf_options_schema,
  }),
  "cookie-parser": z.object({
    secret: z.string(),
  }),
  mailgun: mailgun_options_schema,
  session: session_options_schema,
  discord: discord_options_schema,
});