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

async function fetchKeycloakClientCredentials() {
  return await keycloakClient.grant({
    grant_type: "client_credentials",
  })
}

let keycloakClientCredentials = await fetchKeycloakClientCredentials()

export async function getKeycloakClientCredentials() {
  if (!keycloakClientCredentials.expired()) return keycloakClientCredentials
  keycloakClientCredentials = await fetchKeycloakClientCredentials()
  return keycloakClientCredentials
}

export async function fetchWithClientCredentials(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const { headers, ...restInit } = init ?? {}
  const credentials = await getKeycloakClientCredentials()
  return await fetch(input, { 
    headers: {
      Authorization: `Bearer ${keycloakClientCredentials.access_token}`,
      ...headers,
    },
    ...restInit,
  })
}

const userResponse = await fetchWithClientCredentials("https://admin.auth.durhack.com/admin/realms/durhack/users/4118845c-09dc-4cdf-a242-3d1d8808c8d9")
const user = await userResponse.json()
const { attributes, ...restUser } = user
console.log(attributes)

const resp = await fetchWithClientCredentials("https://admin.auth.durhack.com/admin/realms/durhack/users/4118845c-09dc-4cdf-a242-3d1d8808c8d9", {
  method: "PUT",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    attributes: {
      ...attributes,
      firstNames: "Some Guy",
    },
    ...restUser,
  })
})
console.log(resp)
