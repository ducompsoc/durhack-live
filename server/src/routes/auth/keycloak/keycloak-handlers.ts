import {NextFunction, Request, Response} from "@tinyhttp/app"
import { generators, type Client } from "openid-client"

import { getSession } from "@/auth/session";
import { hostname } from "@/config";
import type { Middleware } from "@/types/middleware"

import { keycloakClient } from "./keycloak-client";
import createHttpError from "http-errors";

export class KeycloakHandlers {
  client: Client
  
  constructor(client: Client) {
    this.client = client
  }
  
  beginOAuth2Flow(): Middleware {
    return async (request: Request, response: Response) => {
      const codeVerifier = generators.codeVerifier()
      const session = await getSession(request, response)
      session.keycloakOAuth2FlowCodeVerifier = codeVerifier
      await session.commit()
      
      const codeChallenge = generators.codeChallenge(codeVerifier)
      
      const url = this.client.authorizationUrl({
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      })
      
      response.redirect(url)
    }
  }
  
  static redirectUri = new URL("/api/auth/keycloak/callback", hostname).toString()
  
  oauth2FlowCallback(): Middleware {
    return async (request: Request, response: Response, next: NextFunction) => {
      const session = await getSession(request, response)
      let codeVerifier: unknown
      try { 
        codeVerifier = session.keycloakOAuth2FlowCodeVerifier
        if (typeof codeVerifier !== "string") throw new createHttpError.BadRequest()
      } finally {
        session.keycloakOAuth2FlowCodeVerifier = undefined
        await session.commit()
      }
      
      const params = this.client.callbackParams(request)
      // todo: get URL from `req` once tinyhttp is fixed
      const tokenSet = await this.client.callback(KeycloakHandlers.redirectUri, params, { code_verifier: codeVerifier })
      console.log(`received and validated tokens ${JSON.stringify(tokenSet)}`);
      console.log(`validated ID Token claims ${JSON.stringify(tokenSet.claims())}`);
      
      const userProfile: unknown = await this.client.userinfo(tokenSet)
      console.log(`received user profile: ${JSON.stringify(userProfile)}`)
      
      next()
    }
  }
}

export const keycloakHandlers = new KeycloakHandlers(keycloakClient)
