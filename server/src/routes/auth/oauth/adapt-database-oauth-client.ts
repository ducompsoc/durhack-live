import type OAuth2Server from "@node-oauth/oauth2-server"
import type { Prisma } from "@prisma/client"

const databaseOAuthClientInclude = {
  clientId: true,
  grants: true,
  redirectUris: true,
  accessTokenLifetime: true,
  refreshTokenLifetime: true,
} satisfies Prisma.OAuthClientSelect

type DatabaseOAuthClient = Prisma.OAuthClientGetPayload<{ select: typeof databaseOAuthClientInclude }>

export function adaptDatabaseOAuthClient(client: DatabaseOAuthClient): OAuth2Server.Client {
  return {
    id: client.clientId,
    grants: client.grants as string[],
    redirectUris: client.redirectUris as string[],
    accessTokenLifetime: client.accessTokenLifetime ?? undefined,
    refreshTokenLifetime: client.refreshTokenLifetime ?? undefined,
  } satisfies OAuth2Server.Client
}
