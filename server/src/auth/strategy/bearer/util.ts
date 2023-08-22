import { z } from "zod";
import config from "config";
import { KeyObject } from "crypto";
import { SignJWT, jwtVerify, generateKeyPair, importPKCS8, importSPKI, JWTVerifyResult } from "jose";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import User from "@/database/user";
import { jwt_options_schema, oauth_options_schema } from "@/common/config_schema";
import { epoch } from "@/common/time";


const jwt_options = jwt_options_schema.parse(config.get("jsonwebtoken"));
const { accessTokenLifetime, refreshTokenLifetime } = oauth_options_schema.parse(config.get("oauth"));

export enum BearerTokenType {
  accessToken = "accessToken",
  refreshToken = "refreshToken",
}

abstract class TokenAuthority {
  public abstract signToken(token: SignJWT): Promise<string>;
  public abstract verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult>;
}

class RSATokenAuthority implements TokenAuthority {
  declare publicKey: KeyObject;
  declare privateKey: KeyObject;

  constructor(options: { publicKey: KeyObject, privateKey: KeyObject }) {
    this.publicKey = options.publicKey;
    this.privateKey = options.privateKey;
  }

  async signToken(token: SignJWT): Promise<string> {
    return await token
      .setIssuer(jwt_options.issuer)
      .setAudience(jwt_options.audience)
      .setProtectedHeader({ alg: "RS256" })
      .sign(this.privateKey);
  }

  async verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await jwtVerify(payload, this.publicKey, {
      issuer: jwt_options.issuer,
      audience: jwt_options.audience,
    });
  }

  static async fromKeyStrings(options: { publicKey: string, privateKey: string }) {
    const [publicKey, privateKey] = await Promise.all([
      importSPKI<KeyObject>(options.publicKey, "RS256"),
      importPKCS8<KeyObject>(options.privateKey, "RS256"),
    ]);
    return new RSATokenAuthority({ publicKey, privateKey });
  }

  static async fromNewKeyPair(options: { publicKeyFilePath: string, privateKeyFilePath: string }) {
    const { publicKey, privateKey } = await generateKeyPair<KeyObject>("RS256");
    await Promise.all([
      async () => {
        await writeFile(options.publicKeyFilePath, await publicKey.export({
          type: "spki",
          format: "pem",
        }));
      },
      async () => {
        await writeFile(options.privateKeyFilePath, await privateKey.export({
          type: "pkcs8",
          format: "pem",
        }));
      },
    ]);
    return new RSATokenAuthority({ publicKey, privateKey });
  }

  static async fromFilePaths(options: { publicKeyFilePath: string, privateKeyFilePath: string }): Promise<RSATokenAuthority> {
    let publicKey, privateKey;
    try {
      [publicKey, privateKey] = await Promise.all([
        readFile(options.publicKeyFilePath, { encoding: "utf-8" }),
        readFile(options.privateKeyFilePath, { encoding: "utf-8" }),
      ]);
    } catch (error) {
      if ((error as { code: unknown }).code === "ENOENT") {
        console.error("RSA key pair not found, generating new key pair.");
        return await RSATokenAuthority.fromNewKeyPair(options);
      }
      throw error;
    }

    return await RSATokenAuthority.fromKeyStrings({ publicKey, privateKey });
  }
}

class HSATokenAuthority implements TokenAuthority {
  declare secret: Uint8Array;

  constructor(options: { secret: string }) {
    this.secret = new TextEncoder().encode(options.secret);
  }

  async signToken(token: SignJWT): Promise<string> {
    return await token
      .setIssuer(jwt_options.issuer)
      .setAudience(jwt_options.audience)
      .setProtectedHeader({ alg: "HS256" })
      .sign(this.secret);
  }

  async verifyToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await jwtVerify(payload, this.secret, {
      issuer: jwt_options.issuer,
      audience: jwt_options.audience,
    });
  }
}

class TokenVault {
  declare authority: TokenAuthority;

  constructor(authority: TokenAuthority) {
    this.authority = authority;
  }

  public async createToken(type: BearerTokenType, user: User): Promise<string> {
    const token = new SignJWT({ "user_id": user.id })
      .setIssuedAt()
      .setExpirationTime(this.getTokenExpiry(type));
    return await this.authority.signToken(token);
  }

  public async createAccessToken(user: User): Promise<string> {
    return await this.createToken(BearerTokenType.accessToken, user);
  }

  public async createRefreshToken(user: User): Promise<string> {
    return await this.createToken(BearerTokenType.refreshToken, user);
  }

  public getTokenLifetime(type: BearerTokenType): number {
    if (type === BearerTokenType.accessToken) {
      return accessTokenLifetime;
    }

    if (type === BearerTokenType.refreshToken) {
      return refreshTokenLifetime;
    }

    throw new Error("Unknown token type.");
  }

  public getTokenExpiry(type: BearerTokenType): number {
    const lifetime = this.getTokenLifetime(type);
    return epoch(new Date()) + lifetime;
  }
}

async function getTokenVault(options: z.infer<typeof jwt_options_schema>): Promise<TokenVault> {
  if (options.algorithm === "rsa") {
    console.log("Making RSA key vault");
    const resolvedOptions = {
      publicKeyFilePath: fileURLToPath(new URL(path.join("..", "..", "..", "..", options.publicKeyFilePath), import.meta.url)),
      privateKeyFilePath: fileURLToPath(new URL(path.join("..", "..", "..", "..", options.privateKeyFilePath), import.meta.url)),
    };
    return new TokenVault(await RSATokenAuthority.fromFilePaths(resolvedOptions));
  }

  if (options.algorithm === "hsa") {
    console.log("Making HSA key vault");
    return new TokenVault(new HSATokenAuthority(options));
  }

  throw new Error("Jsonwebtoken is misconfigured.");
}

export default await getTokenVault(jwt_options);