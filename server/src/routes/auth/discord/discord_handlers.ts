import { z } from "zod";
import { Request, Response } from "express";
import config from "config";
import createHttpError from "http-errors";

import { sendStandardResponse } from "@/common/response";
import { requireLoggedIn } from "@/auth/decorators";

export default class DiscordHandlers {
  @requireLoggedIn
  static async handleBeginDiscordOAuthFlow(request: Request, response: Response) {
    throw new createHttpError.NotImplemented();
  }

  // a discord access code provided via redirect query parameter is exchanged for an access token
  static discord_access_code_schema = z.object({
    code: z.string(),
    state: z.string(),
  });

  // a discord access token represents some privileged claims to access a discord user's info
  static discord_access_token_schema = z.object({
    access_token: z.string(),
    token_type: z.literal("Bearer"),
    expires_in: z.number(),
    refresh_token: z.string(),
    scope: z.string(),
  });

  @requireLoggedIn
  static async handleDiscordOAuthCallback(request: Request, response: Response) {
    const { code, state } = DiscordHandlers.discord_access_code_schema.parse(request.query);

    //todo: verify that `state` matches what was assigned on flow begin

    const discordApiBase = config.get("discord.apiEndpoint");

    const access_code_exchange_payload = {
      "client_id": config.get("discord.clientId") as string,
      "client_secret": config.get("discord.clientSecret") as string,
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": config.get("redirectUri") as string,
    };
    const encoded_access_code_exchange_payload = new URLSearchParams(access_code_exchange_payload);

    const discord_access_token_response = await fetch(`${discordApiBase}/oauth2/token`, {
      method: "POST",
      body: encoded_access_code_exchange_payload,
    });

    if (!discord_access_token_response.ok) {
      throw new createHttpError.BadGateway("Couldn't exchange access code for access token.");
    }

    const { access_token } = DiscordHandlers.discord_access_token_schema.parse(await discord_access_token_response.json());

    const discord_profile_response = await fetch(`${discordApiBase}/oauth2/@me`, {
      headers: {
        "Authorization": `Bearer ${access_token}`,
      },
    });

    if (!discord_profile_response.ok) {
      throw new createHttpError.BadGateway("Failed to read your Discord profile.");
    }

    const discord_profile = await discord_profile_response.json() as any;

    // this is out of date - most discord names now have no discriminator
    await request.user.update({
      discordId: discord_profile.user.id,
      discordName: `${discord_profile.user.username}#${discord_profile.user.discriminator}`,
    });

    // this used to response with a discord invite
    sendStandardResponse(response, 200, "Successfully verified Discord profile.");
  }
}
