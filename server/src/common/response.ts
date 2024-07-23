import { Response } from "@tinyhttp/app"
import { HttpError } from "http-errors"
import { STATUS_CODES } from "http"
import { ZodError } from "zod"
import { OAuthError } from "@node-oauth/oauth2-server"

interface ResponseBody {
  status: number
  message: string
  detail?: string | object
  [key: string]: any
}

function makeHttpErrorResponseBody(error: HttpError): ResponseBody {
  const response_body: ResponseBody = {
    status: error.statusCode,
    message: STATUS_CODES[error.statusCode] || error.message,
  }

  if (error.message && error.message !== response_body.message) {
    response_body.detail = error.message
  }

  return response_body
}

export function sendHttpErrorResponse(response: Response, error: HttpError): void {
  const response_body = makeHttpErrorResponseBody(error)
  response.status(error.statusCode).json(response_body)
}

function makeZodErrorResponseBody(error: ZodError): ResponseBody {
  return {
    status: 400,
    message: STATUS_CODES[400] as string,
    detail: { issues: error.issues },
  }
}

export function sendZodErrorResponse(response: Response, error: ZodError): void {
  const response_body = makeZodErrorResponseBody(error)
  response.status(400).json(response_body)
}

export function makeStandardResponseBody(status: number, message?: string): ResponseBody {
  const response_body: ResponseBody = {
    status: status,
    message: STATUS_CODES[status] || "Unknown status",
  }

  if (message !== undefined) {
    response_body.detail = message
  }

  return response_body
}

export function sendStandardResponse(response: Response, status: number, message?: string): void {
  const response_body = makeStandardResponseBody(status, message)
  response.status(status).json(response_body)
}

export function makeOAuthErrorResponseBody(error: OAuthError): ResponseBody {
  const status = error.code || 500
  return {
    status: status,
    message: STATUS_CODES[status] || "Unknown status",
    reason: error.name,
    detail: error.message,
  }
}

function setWWWAuthenticateHeader(response: Response, error: OAuthError): void {
  if (error.name) {
    response.setHeader("WWW-Authenticate", `Bearer realm="Service",error="${error.name}"`)
    return
  }

  response.setHeader("WWW-Authenticate", 'Bearer realm="Service"')
}

export function sendOAuthErrorResponse(response: Response, error: OAuthError): void {
  const response_body = makeOAuthErrorResponseBody(error)
  setWWWAuthenticateHeader(response, error)
  response.status(response_body.status).json(response_body)
}
