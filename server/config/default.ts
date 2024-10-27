import { TokenType } from "@durhack/token-vault/lib"

import type { ConfigIn } from "@/config/schema"

export default {
  listen: {
    host: "127.0.0.1",
    port: 3201, // Live project has ports 3200-3299
  },
  origin: "http://live.durhack-dev.com",
  flags: {},
  csrf: {
    enabled: true,
    secret: "csrfisoverrated",
    options: {
      cookieOptions: {
        name: "durhack-live.x-csrf-token",
        domain: "live.durhack-dev.com",
        sameSite: "strict",
        path: "/",
        secure: false,
      },
    },
  },
  cookieSigning: {
    secret: "thebestsecretforcookies",
  },
  jsonwebtoken: {
    accessTokenLifetime: 1800,
    refreshTokenLifetime: 1209600,
    issuer: "http://live.durhack-dev.com",
    audience: "http://live.durhack-dev.com",
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
  session: {
    cookie: {
      name: "durhack-live-session",
      domain: "live.durhack-dev.com",
      sameSite: "lax",
      path: "/",
      secure: false,
    },
  },
  discord: {
    apiEndpoint: "https://discord.com/api/v10",
    clientId: "yourDiscordAppClientIdHere",
    clientSecret: "yourDiscordAppClientSecretHere",
    redirectUri: "http://live.durhack-dev.com/api/auth/discord/redirect",
    inviteLink: "https://discord.gg/f5euRmts",
  },
  keycloak: {
    realm: "durhack-dev",
    baseUrl: "https://auth.durhack.com",
    adminBaseUrl: "https://admin.auth.durhack.com",
    clientId: "not-a-real-client-id",
    clientSecret: "not-a-real-client-secret",
    responseTypes: ["code"],
    redirectUris: ["http://live.durhack-dev.com/api/auth/keycloak/callback"],
  },
  hackathonStateSocket: {
    clientSecret: "the-best-ever-secret",
  },
} satisfies ConfigIn
