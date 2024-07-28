import { type ClientMetadata, Issuer } from "openid-client"

import { keycloakConfig } from "@/config"

function adaptClientConfig(clientConfig: typeof keycloakConfig): ClientMetadata {
  return {
    client_id: clientConfig.clientId,
    client_secret: clientConfig.clientSecret,
    redirect_uris: clientConfig.redirectUris,
    response_types: clientConfig.responseTypes,
  } satisfies ClientMetadata
}

export const keycloakIssuer = await Issuer.discover(keycloakConfig.url)

const keycloakClientConfig = adaptClientConfig(keycloakConfig)
export const keycloakClient = new keycloakIssuer.Client(keycloakClientConfig)
