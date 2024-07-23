import type OAuth2Server from "@node-oauth/oauth2-server"
import type { AuthorizationCodeModel, RefreshTokenModel } from "@node-oauth/oauth2-server"
import type { JWTPayload } from "jose"

import { checkTextAgainstHash } from "@/auth/hashed-secrets"
import TokenType from "@/auth/token-type"
import TokenVault from "@/auth/tokens"
import { oauthConfig } from "@/config"
import { OAuthClient, OAuthUser, User } from "@/database/tables"

class OAuthModel implements AuthorizationCodeModel, RefreshTokenModel {
  async generateAccessToken(client: OAuth2Server.Client, user: User, scope: string | string[] | null): Promise<string> {
    const token_lifetime = client.accessTokenLifetime || oauthConfig.accessTokenLifetime

    return await TokenVault.createToken(TokenType.accessToken, user, {
      scope: scope === null ? [] : typeof scope === "string" ? [scope] : scope,
      lifetime: token_lifetime,
      claims: {
        client_id: client.id,
      },
    })
  }

  async getAccessToken(accessToken: string): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    let decodedPayload: JWTPayload
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.accessToken, accessToken)).payload
    } catch (error) {
      return
    }

    if (typeof decodedPayload.client_id !== "string") return
    if (typeof decodedPayload.user_id !== "number") return
    if (typeof decodedPayload.exp !== "number") return
    if (typeof decodedPayload.iat !== "number") return
    if (!Array.isArray(decodedPayload.scope)) return

    const client = await this.getClient(decodedPayload.client_id, null)
    const user = await User.findByPk(decodedPayload.user_id)

    if (!client) return
    if (!user) return

    if (await this.checkTokenRevoked(client, user, decodedPayload.iat)) return

    const expiresAt = new Date(0)
    expiresAt.setSeconds(decodedPayload.exp)

    return {
      accessToken: accessToken,
      accessTokenExpiresAt: expiresAt,
      scope: decodedPayload.scope,
      client: client,
      user: user,
    }
  }

  async generateRefreshToken(
    client: OAuth2Server.Client,
    user: User,
    scope: string | string[] | null,
  ): Promise<string> {
    const token_lifetime = client.refreshTokenLifetime || oauthConfig.refreshTokenLifetime

    return await TokenVault.createToken(TokenType.refreshToken, user, {
      scope: scope === null ? [] : typeof scope === "string" ? [scope] : scope,
      lifetime: token_lifetime,
      claims: {
        client_id: client.id,
      },
    })
  }

  async getRefreshToken(refreshToken: string): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
    let decodedPayload: JWTPayload
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.accessToken, refreshToken)).payload
    } catch (error) {
      return
    }

    if (typeof decodedPayload.client_id !== "string") return
    if (typeof decodedPayload.user_id !== "number") return
    if (typeof decodedPayload.exp !== "number") return
    if (typeof decodedPayload.iat !== "number") return
    if (!Array.isArray(decodedPayload.scope)) return

    const client = await this.getClient(decodedPayload.client_id, null)
    const user = await User.findByPk(decodedPayload.user_id)

    if (!client) return
    if (!user) return

    if (await this.checkTokenRevoked(client, user, decodedPayload.iat)) return

    const expiresAt = new Date(0)
    expiresAt.setSeconds(decodedPayload.exp)

    return {
      refreshToken: refreshToken,
      refreshTokenExpiresAt: expiresAt,
      scope: decodedPayload.scope,
      client: client,
      user: user,
    }
  }

  async saveToken(
    token: OAuth2Server.Token,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.Token | OAuth2Server.Falsey> {
    return {
      ...token,
      client: client,
      user: user,
    }
  }

  private async checkTokenRevoked(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    token_issued_at: number,
  ): Promise<boolean> {
    const oauth_user = await OAuthUser.findOne({
      where: {
        client_id: client.id,
        user_id: user.id,
      },
    })

    return (
      !!oauth_user &&
      !!oauth_user.minimum_token_issue_time &&
      oauth_user.minimum_token_issue_time.getSeconds() >= token_issued_at
    )
  }

  async revokeToken(token: OAuth2Server.RefreshToken | OAuth2Server.Token): Promise<boolean> {
    const [oauth_user] = await OAuthUser.findOrCreate({
      where: {
        client_id: token.client.id,
        user_id: token.user.id,
      },
      defaults: {
        client_id: token.client.id,
        user_id: token.user.id,
      },
    })

    await oauth_user.update({
      minimum_token_issue_time: new Date(),
    })

    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generateAuthorizationCode(
    client: OAuth2Server.Client,
    user: User,
    scope: string | string[] | null,
  ): Promise<string> {
    // return a dummy value - we cannot generate the code here as this method has no access to redirect_uri
    return "abc123"
  }

  async getAuthorizationCode(authorizationCode: string): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    let decodedPayload: JWTPayload
    try {
      decodedPayload = (await TokenVault.decodeToken(TokenType.authorizationCode, authorizationCode)).payload
    } catch (error) {
      return false
    }

    if (typeof decodedPayload.redirect_uri !== "string") return
    if (decodedPayload.code_challenge != null && typeof decodedPayload.code_challenge !== "string") return
    if (decodedPayload.code_challenge_method != null && typeof decodedPayload.code_challenge_method !== "string") return

    if (typeof decodedPayload.client_id !== "string") return
    if (typeof decodedPayload.user_id !== "number") return
    if (typeof decodedPayload.exp !== "number") return
    if (typeof decodedPayload.iat !== "number") return
    if (!Array.isArray(decodedPayload.scope)) return

    const client = await this.getClient(decodedPayload.client_id, null)
    const user = await User.findByPk(decodedPayload.user_id)

    if (!client) return
    if (!user) return

    if (await this.checkAuthorizationCodeRevoked(client, user, decodedPayload.iat)) return

    const expiresAt = new Date(0)
    expiresAt.setSeconds(decodedPayload.exp)

    return {
      authorizationCode: authorizationCode,
      expiresAt: expiresAt,
      redirectUri: decodedPayload.redirect_uri,
      scope: decodedPayload.scope,
      client: client,
      user: user,
      codeChallenge: decodedPayload.code_challenge ?? undefined,
      codeChallengeMethod: decodedPayload.code_challenge_method ?? undefined,
    }
  }

  async saveAuthorizationCode(
    code: Pick<
      OAuth2Server.AuthorizationCode,
      "authorizationCode" | "expiresAt" | "redirectUri" | "scope" | "codeChallenge" | "codeChallengeMethod"
    >,
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
  ): Promise<OAuth2Server.AuthorizationCode | OAuth2Server.Falsey> {
    if (!user.id) return false

    code.authorizationCode = await TokenVault.createToken(
      TokenType.authorizationCode,
      user as { id: string | number },
      {
        scope: code.scope === undefined ? [] : typeof code.scope === "string" ? [code.scope] : code.scope,
        lifetime: 60,
        claims: {
          code_challenge: code.codeChallenge,
          code_challenge_method: code.codeChallengeMethod,
          redirect_uri: code.redirectUri,
          client_id: client.id,
        },
      },
    )

    return {
      ...code,
      client: client,
      user: user,
    }
  }

  private async checkAuthorizationCodeRevoked(
    client: OAuth2Server.Client,
    user: OAuth2Server.User,
    code_issued_at: number,
  ): Promise<boolean> {
    const oauth_user = await OAuthUser.findOne({
      where: {
        client_id: client.id,
        user_id: user.id,
      },
    })

    return (
      !!oauth_user &&
      !!oauth_user.minimum_auth_code_issue_time &&
      oauth_user.minimum_auth_code_issue_time.getSeconds() >= code_issued_at
    )
  }

  async revokeAuthorizationCode(code: OAuth2Server.AuthorizationCode): Promise<boolean> {
    const [oauth_user] = await OAuthUser.findOrCreate({
      where: {
        client_id: code.client.id,
        user_id: code.user.id,
      },
      defaults: {
        client_id: code.client.id,
        user_id: code.user.id,
      },
    })

    await oauth_user.update({
      minimum_auth_code_issue_time: new Date(),
    })

    return true
  }

  async getClient(clientId: string, clientSecret: string | null): Promise<OAuth2Server.Client | OAuth2Server.Falsey> {
    const client = await OAuthClient.findByPk(clientId)

    if (!client) return false
    if (clientSecret === null) return client
    if (!client) return

    const secretMatches = await checkTextAgainstHash(
      {
        hashed_secret: client.hashedSecret,
        salt: client.secretSalt,
      },
      clientSecret,
    )

    if (!secretMatches) return

    return client
  }

  async validateScope(
    user: User,
    client: OAuth2Server.Client,
    scope?: string | string[],
  ): Promise<string[] | OAuth2Server.Falsey> {
    if (typeof scope === "undefined") return
    if (scope === "") return
    if (Array.isArray(scope) && scope.length === 0) return
    if (!Array.isArray(client.allowedScopes)) return

    if (typeof scope === "string") {
      if (!client.allowedScopes.includes(scope)) return false
      return [scope]
    }

    if (!scope.every((element) => client.allowedScopes.includes(element))) return false
    return scope
  }

  async validateRedirectUri(redirectUri: string, client: OAuth2Server.Client) {
    if (!client.redirectUris) return false
    if (typeof client.redirectUris === "string") return redirectUri === client.redirectUris
    return client.redirectUris.includes(redirectUri)
  }

  async verifyScope(token: OAuth2Server.Token, scope: string | string[]): Promise<boolean> {
    if ((Array.isArray(scope) && scope.length === 0) || scope === "" || typeof scope === "undefined") return true
    if (token.scope == null) return false
    if (token.scope.length === 0) return false

    if (typeof scope === "string") {
      return token.scope.includes(scope)
    }

    return scope.every((element) => token.scope?.includes(element) ?? false)
  }
}

export const oauthModel = new OAuthModel()
