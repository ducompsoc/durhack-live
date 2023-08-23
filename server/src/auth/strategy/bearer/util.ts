import { z } from "zod";
import config from "config";
import { KeyObject } from "crypto";
import { SignJWT, jwtVerify, generateKeyPair, importPKCS8, importSPKI, JWTVerifyResult, JWTPayload } from "jose";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import User from "@/database/user";
import { jwt_options_schema, oauth_options_schema } from "@/common/schema/config";
import { epoch } from "@/common/time";
import { NullError } from "@/common/errors";

import { TokenError } from "./jwt_error";


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
    console.debug("Generating key pair...");
    const { publicKey, privateKey } = await generateKeyPair<KeyObject>("RS256");
    console.debug("Generated key pair.");
    console.debug("Writing key pair to filesystem...");
    await Promise.all([
      async function () {
        await writeFile(options.publicKeyFilePath, await publicKey.export({
          type: "spki",
          format: "pem",
        }));
        console.debug(`Written public key to ${options.publicKeyFilePath}`);
      }(),
      async function() {
        await writeFile(options.privateKeyFilePath, await privateKey.export({
          type: "pkcs8",
          format: "pem",
        }));
        console.debug(`Written private key to ${options.privateKeyFilePath}`);
      }(),
    ]);

    console.log("Written key pair to filesystem.");
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
  declare accessTokenAuthority: TokenAuthority;
  declare refreshTokenAuthority: TokenAuthority;

  constructor(accessTokenAuthority: TokenAuthority, refreshTokenAuthority: TokenAuthority) {
    this.accessTokenAuthority = accessTokenAuthority;
    this.refreshTokenAuthority = refreshTokenAuthority;
  }

  public async createToken(type: BearerTokenType, user: User, scope: string[] = undefined): Promise<string> {
    if (!scope) {
      scope = this.getDefaultTokenScope(type);
    }
    const token = new SignJWT({ user_id: user.id, scope: scope })
      .setIssuedAt()
      .setExpirationTime(this.getTokenExpiry(type));
    return await this.getTokenAuthority(type).signToken(token);
  }

  public async decodeAccessToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await this.accessTokenAuthority.verifyToken(payload);
  }

  public async decodeRefreshToken(payload: string | Uint8Array): Promise<JWTVerifyResult> {
    return await this.refreshTokenAuthority.verifyToken(payload);
  }

  public async getUserAndScopeClaims(payload: JWTPayload): Promise<{ user: User, scope: string[] }> {
    const user_id = payload["user_id"];
    const scope = payload["scope"];

    if (typeof user_id !== "number") {
      throw new TokenError("Invalid user ID");
    }

    if (!(Array.isArray(scope) && scope.every((e) => typeof e === "string"))) {
      throw new TokenError("Invalid scope");
    }

    const user = await User.findByPk(user_id, { rejectOnEmpty: new NullError("User not found") });
    return { user, scope };
  }

  public async createAccessToken(user: User, scope: string[]): Promise<string> {
    return await this.createToken(BearerTokenType.accessToken, user, scope);
  }

  public async createRefreshToken(user: User, scope: string[]): Promise<string> {
    return await this.createToken(BearerTokenType.refreshToken, user, scope);
  }

  private getDefaultTokenScope(type: BearerTokenType): string[] {
    if (type === BearerTokenType.accessToken) {
      return [ "api" ];
    }

    if (type === BearerTokenType.refreshToken) {
      return [ "refresh" ];
    }

    throw new Error("Unknown token type.");
  }

  private getTokenLifetime(type: BearerTokenType): number {
    if (type === BearerTokenType.accessToken) {
      return accessTokenLifetime;
    }

    if (type === BearerTokenType.refreshToken) {
      return refreshTokenLifetime;
    }

    throw new Error("Unknown token type.");
  }

  private getTokenExpiry(type: BearerTokenType): number {
    const lifetime = this.getTokenLifetime(type);
    return epoch(new Date()) + lifetime;
  }

  private getTokenAuthority(type: BearerTokenType): TokenAuthority {
    if (type === BearerTokenType.accessToken) {
      return this.accessTokenAuthority;
    }

    if (type === BearerTokenType.refreshToken) {
      return this.refreshTokenAuthority;
    }

    throw new Error("Unknown token type.");
  }
}

function resolveFilePathFromProjectRoot(path_to_resolve: string) {
  return fileURLToPath(new URL(path.join("..", "..", "..", "..", path_to_resolve), import.meta.url));
}

async function getTokenVault(options: z.infer<typeof jwt_options_schema>): Promise<TokenVault> {
  if (options.algorithm === "rsa") {
    console.debug("Instantiating RSA key vault...");
    const accessTokenAuthorityOptions = {
      publicKeyFilePath: resolveFilePathFromProjectRoot(options.accessTokenPublicKeyFilePath),
      privateKeyFilePath: resolveFilePathFromProjectRoot(options.accessTokenPrivateKeyFilePath),
    };
    const refreshTokenAuthorityOptions = {
      publicKeyFilePath: resolveFilePathFromProjectRoot(options.refreshTokenPublicKeyFilePath),
      privateKeyFilePath: resolveFilePathFromProjectRoot(options.refreshTokenPrivateKeyFilePath),
    };
    return new TokenVault(
      await RSATokenAuthority.fromFilePaths(accessTokenAuthorityOptions),
      await RSATokenAuthority.fromFilePaths(refreshTokenAuthorityOptions),
    );
  }

  if (options.algorithm === "hsa") {
    console.debug("Instantiating HSA key vault...");
    return new TokenVault(
      new HSATokenAuthority({ secret: options.accessTokenSecret }),
      new HSATokenAuthority({ secret: options.refreshTokenSecret }),
    );
  }

  throw new Error("Jsonwebtoken is misconfigured.");
}

export default await getTokenVault(jwt_options);