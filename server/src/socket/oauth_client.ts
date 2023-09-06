import config from "config";
import { z } from "zod";

import { OAuthClient } from "@/database/tables";
import { checkTextAgainstHash } from "@/auth/hashed_secrets";


export default async function getStateSocketClient() {
  const [stateOAuthClient] = await OAuthClient.findOrCreate({
    where: {
      id: "state-socket",
    },
    defaults: {
      id: "state-socket",
      grants: ["authorization_code"],
      access_token_lifetime: 86400 * 3,
      allowed_scopes: [ "socket:state" ],
      redirect_uris: [],
    },
  });
  return stateOAuthClient;
}

export async function updateStateSocketSecret(client: OAuthClient) {
  const clientSecret = z.string().parse(config.get("hackathonStateSocket.clientSecret"));

  if (
    client.hashed_secret instanceof Buffer
    && client.secret_salt instanceof Buffer
    && await checkTextAgainstHash(
      {
        hashed_secret: client.hashed_secret,
        salt: client.secret_salt,
      },
      clientSecret
    )
  ) return;

  await client.updateSecret(clientSecret);

}
