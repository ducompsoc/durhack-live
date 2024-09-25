import { TokenType } from "@durhack/token-vault/lib"

import type { DeepPartial } from "@/types/deep-partial"
import type { ConfigIn } from "./schema"

export default {
  origin: "https://live.durhack.com",
  csrf: {
    enabled: true,
    options: {
      cookieOptions: {
        name: "__Host-durhack-live.x-csrf-token",
        domain: undefined,
        sameSite: "strict",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    cookie: {
      name: "__Host-durhack-live-session",
      domain: undefined,
      path: "/",
      secure: true,
      sameSite: "lax",
    },
  },
  jsonwebtoken: {
    issuer: "https://live.durhack.com",
    audience: "https://live.durhack.com",
    authorities: [
      {
        for: TokenType.accessToken,
        algorithm: "rsa",
        publicKeyFilePath: "keys/accessToken.pub.pem",
        privateKeyFilePath: "keys/accessToken.pem",
      },
      {
        for: TokenType.refreshToken,
        algorithm: "rsa",
        publicKeyFilePath: "keys/refreshToken.pub.pem",
        privateKeyFilePath: "keys/refreshToken.pem",
      },
      {
        for: TokenType.authorizationCode,
        algorithm: "rsa",
        publicKeyFilePath: "keys/authorizationCode.pub.pem",
        privateKeyFilePath: "keys/authorizationCode.pem",
      },
    ],
  },
  discord: {
    redirectUri: "https://live.durhack.com/api/auth/discord/redirect",
  },
  keycloak: {
    realm: "durhack",
    redirectUris: ["https://live.durhack.com/api/auth/keycloak/callback"],
  },
} satisfies DeepPartial<ConfigIn>
