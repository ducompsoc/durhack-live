import { TokenType } from "@durhack/token-vault/lib"
import type { ConfigIn } from "./schema"

export default {
  listen: {
    host: "127.0.0.1",
    port: 3001,
  },
  hostname: "http://localhost:3001",
  flags: {
    skipEmailVerification: false,
  },
  database: {
    data: {
      host: "127.0.0.1",
      port: 3306,
      database: "durhack",
      username: "root",
      password: "strongexamplepassword",
    },
    session: {
      host: "127.0.0.1",
      port: 3306,
      database: "durhack-session",
      username: "root",
      password: "strongexamplepassword",
    },
  },
  csrf: {
    enabled: true,
    secret: "csrfisoverrated",
    options: {
      cookieOptions: {
        name: "durhack.x-csrf-token",
        sameSite: "strict",
        path: "/",
        secure: false,
      },
    },
  },
  cookieParser: {
    secret: "thebestsecretforcookies",
  },
  jsonwebtoken: {
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 1209600,
    issuer: "http://localhost:8080",
    audience: "http://localhost:8080",
    authorities: [
      {
        for: TokenType.accessToken,
        algorithm: "hsa",
        secret: "totally-a-secure-SECRET",
      },
      {
        for: TokenType.refreshToken,
        algorithm: "hsa",
        secret: "an-even-more-secure-SECRET",
      },
      {
        for: TokenType.authorizationCode,
        algorithm: "hsa",
        secret: "the-MOST-secure-SECRET",
      },
    ],
  },
  oauth: {
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 1209600,
    allowEmptyState: false,
    allowExtendedTokenAttributes: true,
    useErrorHandler: true,
    continueMiddleware: false,
  },
  session: {
    name: "durhack-live-session",
    signingSecret: "session_cookie_secret",
    cookie: { secure: false },
  },
  discord: {
    apiEndpoint: "https://discord.com/api/v10",
    clientId: "yourDiscordAppClientIdHere",
    clientSecret: "yourDiscordAppClientSecretHere",
    redirectUri: "http://localhost:3001/api/auth/discord/redirect",
    inviteLink: "https://discord.gg/f5euRmts",
  },
  keycloak: {
    url: "https://auth.durhack.com/realms/durhack",
    clientId: "not-a-real-client-id",
    clientSecret: "not-a-real-client-secret",
    responseTypes: ["code"],
    redirectUris: ["https://live.durhack.com/api/auth/keycloak/callback"],
  },
  hackathonStateSocket: {
    clientSecret: "the-best-ever-secret",
  },
} satisfies ConfigIn
