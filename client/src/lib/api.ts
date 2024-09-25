"use client"

import { posix } from "path"

const isClient = typeof window !== "undefined"
export const live_api_base = isClient ? window.location.origin : ""
export const live_api_path = "api"

/**
 * Gets a CSRF token and saves the token hash to a cookie.
 * Both the cookie and the token need to be sent on API requests (excluding GET, HEAD, OPTIONS).
 * The token should be attached to requests in an HTTP header 'x-csrf-token'.
 */
export async function getCsrfToken(): Promise<string> {
  const csrf_token_request = await makeLiveApiRequest("/auth/csrf-token")

  const result = await fetch(csrf_token_request) // can throw Error due to network problems
  if (!result.ok) throw new Error("Couldn't get CSRF token")
  return (await result.json()).token
}

/**
 * Gets a CSRF token and saves the token hash to a cookie, then attaches
 * the token to the given request as an HTTP header.
 */
export async function attachCsrfTokenToRequest(request: Request): Promise<void> {
  const csrf_token = await getCsrfToken()
  request.headers.set("x-csrf-token", csrf_token)
}

export async function makeLiveApiRequest(endpoint: string, options?: RequestInit): Promise<Request> {
  const api_endpoint_url = new URL(posix.join(live_api_path, endpoint).normalize(), live_api_base)
  const request = new Request(api_endpoint_url, options)

  if (!!options?.method && !["GET", "HEAD", "OPTIONS"].includes(options.method)) {
    await attachCsrfTokenToRequest(request)
  }

  return request
}

export async function query(...args: unknown[]): Promise<unknown> {
  return undefined
}
