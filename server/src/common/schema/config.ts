import { z } from "zod";
import TokenType from "@/auth/token_type";

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

export const sequelize_options_schema = mysql_options_schema.extend({
  dialect: z.string().default("mysql"),
}).transform((options) => ({
  host: options.host,
  port: options.port,
  database: options.database,
  username: options.user,
  password: options.password,
  dialect: options.dialect,
}));

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
  sendAsDomain: z.string(),
  url: z.string(),
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

const rsa_token_authority_schema = z.object({
  for: z.nativeEnum(TokenType),
  algorithm: z.literal("rsa"),
  publicKeyFilePath: z.string(),
  privateKeyFilePath: z.string(),
});

const hsa_token_authority_schema = z.object({
  for: z.nativeEnum(TokenType),
  algorithm: z.literal("hsa"),
  secret: z.string(),
});

export const token_authority_schema = z.union([rsa_token_authority_schema, hsa_token_authority_schema]);

export const jwt_options_schema = z.object({
  issuer: z.string().url(),
  audience: z.string().url(),
  authorities: z.array(token_authority_schema),
});

export const oauth_options_schema = z.object({
  accessTokenLifetime: z.number().positive(),
  refreshTokenLifetime: z.number().positive(),
  allowEmptyState: z.boolean(),
  allowExtendedTokenAttributes: z.boolean(),
  useErrorHandler: z.boolean(),
  continueMiddleware: z.boolean(),
});

export const config = z.object({
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
  jsonwebtoken: jwt_options_schema,
  oauth: oauth_options_schema,
  mailgun: mailgun_options_schema,
  session: session_options_schema,
  discord: discord_options_schema,
  "hackathonStateSocket": z.object({
    "clientSecret": z.string(),
  }),
});
