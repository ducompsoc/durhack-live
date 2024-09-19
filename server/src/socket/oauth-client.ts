import { checkTextAgainstHash } from "@/auth/hashed-secrets"
import { hackathonStateSocketConfig } from "@/config"
import { type OAuthClient, prisma } from "@/database"

export default async function getStateSocketClient() {
  const stateOAuthClient = await prisma.oAuthClient.upsert({
    where: {
      clientId: "state-socket",
    },
    update: {},
    create: {
      clientId: "state-socket",
      name: "DurHack Live Event State",
      grants: ["authorization_code"] satisfies string[],
      accessTokenLifetime: 86400 * 3,
      allowedScopes: ["socket:state"],
      redirectUris: [],
    },
  })
  return stateOAuthClient
}

export async function updateStateSocketSecret(client: OAuthClient) {
  const { clientSecret } = hackathonStateSocketConfig

  if (
    client.hashedSecret instanceof Buffer &&
    client.secretSalt instanceof Buffer &&
    (await checkTextAgainstHash(
      {
        hashed_secret: client.hashedSecret,
        salt: client.secretSalt,
      },
      clientSecret,
    ))
  )
    return

  await prisma.oAuthClient.updateSecret({
    where: {
      clientId: client.clientId,
    },
    data: {
      secret: clientSecret,
    },
  })
}
