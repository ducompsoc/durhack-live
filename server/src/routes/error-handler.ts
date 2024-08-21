import { OAuthError } from "@node-oauth/oauth2-server"
import type { App, Request, Response } from "@otterhttp/app"
import createHttpError, { isHttpError } from "http-errors"
import { ZodError } from "zod"

import { ConflictError, NullError, ValueError } from "@/common/errors"
import { sendHttpErrorResponse, sendOAuthErrorResponse, sendZodErrorResponse } from "@/common/response"

export default function apiErrorHandler(this: App, error: unknown, request: Request, response: Response) {
  if (response.headersSent) {
    return
  }

  if (isHttpError(error)) {
    return sendHttpErrorResponse(response, error)
  }

  if (error instanceof OAuthError) {
    return sendOAuthErrorResponse(response, error)
  }

  if (error instanceof ZodError) {
    return sendZodErrorResponse(response, error)
  }

  if (error instanceof ValueError) {
    return sendHttpErrorResponse(response, new createHttpError.BadRequest(error.message))
  }

  if (error instanceof NullError) {
    return sendHttpErrorResponse(response, new createHttpError.NotFound(error.message))
  }

  if (error instanceof ConflictError) {
    return sendHttpErrorResponse(response, new createHttpError.Conflict(error.message))
  }

  if (error instanceof Error) {
    console.error("Unexpected API error:")
    console.error(error)
    return sendHttpErrorResponse(response, new createHttpError.InternalServerError())
  }

  console.error("Unexpected throw:")
  console.error(error)
  return sendHttpErrorResponse(response, new createHttpError.InternalServerError())
}
