import { sign, unsign } from "@otterhttp/cookie-signature"

import { cookieParserConfig } from "@/config"

export function signCookie(value: string): string {
  return encodeURIComponent(sign(value, cookieParserConfig.secret))
}

export function matchSignedCookie(value: string): boolean {
  return decodeURIComponent(value).startsWith("s:")
}

export function unsignCookie(encodedValue: string): string {
  const result = unsign(decodeURIComponent(encodedValue).slice(2), cookieParserConfig.secret)
  if (result === false) throw new Error("Failed to unsign cookie")
  return result
}
