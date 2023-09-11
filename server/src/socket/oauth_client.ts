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
      name: "DurHack Live Event State",
      grants: ["authorization_code"],
      accessTokenLifetime: 86400 * 3,
      allowedScopes: [ "socket:state" ],
      redirectUris: [],
    },
  });
  return stateOAuthClient;
}

export async function updateStateSocketSecret(client: OAuthClient) {
  const clientSecret = z.string().parse(config.get("hackathonStateSocket.clientSecret"));

  if (
    client.hashedSecret instanceof Buffer
    && client.secretSalt instanceof Buffer
    && await checkTextAgainstHash(
      {
        hashed_secret: client.hashedSecret,
        salt: client.secretSalt,
      },
      clientSecret
    )
  ) return;

  await client.updateSecret(clientSecret);

}
