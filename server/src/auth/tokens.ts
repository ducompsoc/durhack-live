import { z } from "zod"
import config from "config"
import { KeyObject } from "crypto"
import { SignJWT, jwtVerify, generateKeyPair, importPKCS8, importSPKI, JWTVerifyResult, JWTPayload } from "jose"
import { readFile, writeFile } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

import User from "@/database/tables/user"
import { jwt_options_schema, oauth_options_schema, token_authority_schema } from "@/common/schema/config"
import { epoch } from "@/common/time"
import { NullError } from "@/common/errors"

import { TokenError } from "./jwt_error"
import TokenType from "./token_type"

const jwt_options = jwt_options_schema.parse(config.get("jsonwebtoken"))
const { accessTokenLifetime, refreshTokenLifetime } = oauth_options_schema.parse(config.get("oauth"))

abstract class TokenAuthority {
  public abstract signToken(token: SignJWT): Promise<string>
  public abstract verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult>
}

class RSATokenAuthority implements TokenAuthority {
  declare publicKey: KeyObject
  declare privateKey: KeyObject

  constructor(options: { publicKey: KeyObject; privateKey: KeyObject }) {
    this.publicKey = options.publicKey
    this.privateKey = options.privateKey
  }

  async signToken(token: SignJWT): Promise<string> {
    return await token
      .setIssuer(jwt_options.issuer)
      .setAudience(jwt_options.audience)
      .setProtectedHeader({ alg: "RS256" })
      .sign(this.privateKey)
  }

  async verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await jwtVerify(payload, this.publicKey, {
      issuer: jwt_options.issuer,
      audience: jwt_options.audience,
    })
  }

  static async fromKeyStrings(options: { publicKey: string; privateKey: string }) {
    const [publicKey, privateKey] = await Promise.all([
      importSPKI<KeyObject>(options.publicKey, "RS256"),
      importPKCS8<KeyObject>(options.privateKey, "RS256"),
    ])
    return new RSATokenAuthority({ publicKey, privateKey })
  }

  static async fromNewKeyPair(options: { publicKeyFilePath: string; privateKeyFilePath: string }) {
    console.debug("Generating key pair...")
    const { publicKey, privateKey } = await generateKeyPair<KeyObject>("RS256")
    console.debug("Generated key pair.")
    console.debug("Writing key pair to filesystem...")

    async function writePublicKey() {
      await writeFile(
        options.publicKeyFilePath,
        await publicKey.export({
          type: "spki",
          format: "pem",
        }),
      )
      console.debug(`Written public key to ${options.publicKeyFilePath}`)
    }

    async function writePrivateKey() {
      await writeFile(
        options.privateKeyFilePath,
        await privateKey.export({
          type: "pkcs8",
          format: "pem",
        }),
      )
      console.debug(`Written private key to ${options.privateKeyFilePath}`)
    }

    await Promise.all([writePublicKey(), writePrivateKey()])

    console.debug("Written key pair to filesystem.")
    return new RSATokenAuthority({ publicKey, privateKey })
  }

  static async fromFilePaths(options: {
    publicKeyFilePath: string
    privateKeyFilePath: string
  }): Promise<RSATokenAuthority> {
    let publicKey, privateKey
    try {
      ;[publicKey, privateKey] = await Promise.all([
        readFile(options.publicKeyFilePath, { encoding: "utf-8" }),
        readFile(options.privateKeyFilePath, { encoding: "utf-8" }),
      ])
    } catch (error) {
      if ((error as { code: unknown }).code === "ENOENT") {
        console.error("RSA key pair not found, generating new key pair.")
        return await RSATokenAuthority.fromNewKeyPair(options)
      }
      throw error
    }

    return await RSATokenAuthority.fromKeyStrings({ publicKey, privateKey })
  }
}

class HSATokenAuthority implements TokenAuthority {
  declare secret: Uint8Array

  constructor(options: { secret: string }) {
    this.secret = new TextEncoder().encode(options.secret)
  }

  async signToken(token: SignJWT): Promise<string> {
    return await token
      .setIssuer(jwt_options.issuer)
      .setAudience(jwt_options.audience)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secret)
  }

  async verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await jwtVerify(payload, this.secret, {
      issuer: jwt_options.issuer,
      audience: jwt_options.audience,
    })
  }
}

interface TokenOptions {
  scope?: string[]
  lifetime?: string | number
  claims?: { [key: string]: unknown }
}

class TokenVault {
  declare authorities: Map<TokenType, TokenAuthority>

  constructor() {
    this.authorities = new Map()
  }

  public registerAuthority(type: TokenType, authority: TokenAuthority) {
    this.authorities.set(type, authority)
  }

  public async createToken(type: TokenType, user: { id: string | number }, options: TokenOptions): Promise<string> {
    let { scope, lifetime, claims } = options
    if (!scope) {
      scope = this.getDefaultTokenScope(type)
    }
    if (!lifetime) {
      lifetime = this.getDefaultTokenLifetime(type)
    }
    if (!claims) {
      claims = {}
    }

    const corePayload = { user_id: user.id, scope: scope }

    const expiry = this.lifetimeToExpiry(lifetime)
    const token = new SignJWT({ ...claims, ...corePayload }).setIssuedAt().setExpirationTime(expiry)

    return await this.getTokenAuthority(type).signToken(token)
  }

  public async decodeToken(type: TokenType, payload: string | Uint8Array): Promise<JWTVerifyResult> {
    const authority = this.authorities.get(type)
    if (typeof authority === "undefined") throw new NullError("No registered authority for token type.")
    return await authority.verifyToken(payload)
  }

  public async getUserAndScopeClaims(payload: JWTPayload): Promise<{ user: User; scope: string[] }> {
    const user_id = payload["user_id"]
    const scope = payload["scope"]

    if (typeof user_id !== "number") {
      throw new TokenError("Invalid user ID")
    }

    if (!(Array.isArray(scope) && scope.every(e => typeof e === "string"))) {
      throw new TokenError("Invalid scope")
    }

    const user = await User.findByPk(user_id, { rejectOnEmpty: new NullError("User not found") })
    return { user, scope }
  }

  public async createAccessToken(user: User, options: TokenOptions): Promise<string> {
    return await this.createToken(TokenType.accessToken, user, options)
  }

  public async createRefreshToken(user: User, options: TokenOptions): Promise<string> {
    return await this.createToken(TokenType.refreshToken, user, options)
  }

  private getDefaultTokenScope(type: TokenType): string[] {
    if (type === TokenType.accessToken) {
      return ["api"]
    }

    if (type === TokenType.refreshToken) {
      return ["refresh"]
    }

    if (type === TokenType.authorizationCode) {
      return []
    }

    throw new Error("Unknown token type.")
  }

  private getDefaultTokenLifetime(type: TokenType): number {
    if (type === TokenType.accessToken) {
      return accessTokenLifetime
    }

    if (type === TokenType.refreshToken) {
      return refreshTokenLifetime
    }

    if (type === TokenType.authorizationCode) {
      return 60
    }

    throw new Error("Unknown token type.")
  }

  public lifetimeToExpiry(lifetime: number | string): number | string {
    if (typeof lifetime === "string") return lifetime
    return epoch(new Date()) + lifetime
  }

  private getTokenAuthority(type: TokenType): TokenAuthority {
    const authority = this.authorities.get(type)
    if (typeof authority === "undefined") throw new NullError("No registered authority for token type.")
    return authority
  }
}

function resolveFilePathFromProjectRoot(path_to_resolve: string) {
  return fileURLToPath(new URL(path.join("..", "..", path_to_resolve), import.meta.url))
}

async function getAuthority(options: z.infer<typeof token_authority_schema>) {
  if (options.algorithm === "rsa") {
    console.debug(`Instantiating RSA authority for ${options.for}...`)
    const authorityOptions = {
      publicKeyFilePath: resolveFilePathFromProjectRoot(options.publicKeyFilePath),
      privateKeyFilePath: resolveFilePathFromProjectRoot(options.privateKeyFilePath),
    }
    return {
      for: options.for,
      authority: await RSATokenAuthority.fromFilePaths(authorityOptions),
    }
  }

  if (options.algorithm === "hsa") {
    console.debug(`Instantiating HSA authority for ${options.for}...`)
    return {
      for: options.for,
      authority: new HSATokenAuthority({ secret: options.secret }),
    }
  }

  throw new Error("Jsonwebtoken is misconfigured.")
}

async function getTokenVault(options: z.infer<typeof jwt_options_schema>): Promise<TokenVault> {
  const { authorities } = options
  const authoritiesWithInfo = await Promise.all(authorities.map(getAuthority))

  const vault = new TokenVault()

  authoritiesWithInfo.forEach(authorityWithInfo => {
    vault.registerAuthority(authorityWithInfo.for, authorityWithInfo.authority)
  })

  return vault
}

export default await getTokenVault(jwt_options)
