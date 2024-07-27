import { randomBytesAsync } from "@/auth/hashed-secrets"
import type { Request, Response } from "@tinyhttp/app"
import createHttpError from "http-errors"
import { z } from "zod"

import { requireLoggedIn } from "@/auth/decorators"
import { discordConfig } from "@/config"
import type { User } from "@/database/tables"
import type { Middleware } from "@/types/middleware"

export class DiscordHandlers {
  @requireLoggedIn
  handleBeginDiscordOAuthFlow(): Middleware {
    return async (request: Request, response: Response): Promise<void> => {
      response.redirect(
        `https://discord.com/oauth2/authorize?client_id=${discordConfig.clientId}&redirect_uri=${encodeURIComponent(
          discordConfig.redirectUri,
        )}&response_type=code&scope=identify&state=dh`,
      )
    }
  }

  // a discord access code provided via redirect query parameter is exchanged for an access token
  static discordAccessCodeSchema = z.object({
    code: z.string(),
    state: z.string(),
  })

  // a discord access token represents some privileged claims to access a discord user's info
  static discordAccessTokenSchema = z.object({
    access_token: z.string(),
    token_type: z.literal("Bearer"),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string(),
  })

  // a discord profile contains basic user information
  static discordProfileSchema = z.object({
    user: z.object({
      id: z.string(),
      username: z.string(),
    }),
  })

  @requireLoggedIn
  handleDiscordOAuthCallback(): Middleware {
    return async (request: Request & { user?: User }, response: Response): Promise<void> => {
      const { code, state } = DiscordHandlers.discordAccessCodeSchema.parse(request.query)

      //todo: verify that `state` matches what was assigned on flow begin

      const discordApiBase = discordConfig.apiEndpoint

      const accessCodeExchangePayload = {
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: discordConfig.redirectUri,
      }
      const encodedAccessCodeExchangePayload = new URLSearchParams(accessCodeExchangePayload)

      const discordAccessTokenResponse = await fetch(`${discordApiBase}/oauth2/token`, {
        method: "POST",
        body: encodedAccessCodeExchangePayload,
      })

      if (!discordAccessTokenResponse.ok) {
        throw new createHttpError.BadGateway("Couldn't exchange access code for access token.")
      }

      const { access_token } = DiscordHandlers.discordAccessTokenSchema.parse(await discordAccessTokenResponse.json())

      const discordProfileResponse = await fetch(`${discordApiBase}/oauth2/@me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (!discordProfileResponse.ok) {
        throw new createHttpError.BadGateway("Failed to read your Discord profile.")
      }

      const rawDiscordProfile: unknown = await discordProfileResponse.json()
      const discordProfile = DiscordHandlers.discordProfileSchema.parse(rawDiscordProfile)

      if (!request.user) throw new Error() // should never occur due to decorator

      await request.user.update({
        discord_id: discordProfile.user.id,
        discord_name: discordProfile.user.username,
      })

      response.redirect(discordConfig.inviteLink)
    }
  }
}

export const discordHandlers = new DiscordHandlers()
